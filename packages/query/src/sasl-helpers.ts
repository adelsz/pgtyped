/**
 * SASL-helpers for authentication using SASL
 */
import { cString } from '@pgtyped/wire';
import crypto from 'crypto';

export function createInitialSASLResponse(): {
  response: string;
  clientNonce: string;
} {
  const clientNonce = crypto.randomBytes(18).toString('base64');
  return { response: 'n,,n=*,r=' + clientNonce, clientNonce };
}

export function createClientSASLContinueResponse(
  password: string,
  clientNonce: string,
  SASLData: string,
): { response: string; calculatedServerSignature: string } {
  const SASLContinueServerVariables =
    extractVariablesFromSASLContinueServerMessage(SASLData);

  if (!SASLContinueServerVariables.nonce.startsWith(clientNonce)) {
    throw new Error(
      'SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce',
    );
  }

  const passwordBytes = cString(password);

  const saltBytes = Buffer.from(SASLContinueServerVariables.salt, 'base64');
  const saltedPassword = Hi(
    passwordBytes,
    saltBytes,
    SASLContinueServerVariables.iteration,
  );

  const clientKey = createHMAC(saltedPassword, 'Client Key');
  const storedKey = crypto.createHash('sha256').update(clientKey).digest();

  const clientFirstMessageBare = 'n=*,r=' + clientNonce;
  const serverFirstMessage =
    'r=' +
    SASLContinueServerVariables.nonce +
    ',s=' +
    SASLContinueServerVariables.salt +
    ',i=' +
    SASLContinueServerVariables.iteration;

  const clientFinalMessageWithoutProof =
    'c=biws,r=' + SASLContinueServerVariables.nonce;

  const authMessage =
    clientFirstMessageBare +
    ',' +
    serverFirstMessage +
    ',' +
    clientFinalMessageWithoutProof;

  const clientSignature = createHMAC(storedKey, authMessage);
  const clientProofBytes = xorBuffers(clientKey, clientSignature);
  const clientProof = clientProofBytes.toString('base64');

  const serverKey = createHMAC(saltedPassword, 'Server Key');
  const serverSignatureBytes = createHMAC(serverKey, authMessage);

  const calculatedServerSignature = serverSignatureBytes.toString('base64');

  return {
    response: clientFinalMessageWithoutProof + ',p=' + clientProof,
    calculatedServerSignature,
  };
}

export function checkServerFinalMessage(
  serverData: string,
  calculatedServerSignature: string,
) {
  const attrPairs = parseAttributePairs(serverData);
  const serverSignatureFromServer = attrPairs.get('v');
  if (!serverSignatureFromServer) {
    throw new Error(
      'SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing',
    );
  } else if (!isBase64(serverSignatureFromServer)) {
    throw new Error(
      'SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64',
    );
  }

  if (calculatedServerSignature !== serverSignatureFromServer) {
    throw new Error(
      'SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match',
    );
  }
}

function extractVariablesFromSASLContinueServerMessage(data: string): {
  nonce: string;
  salt: string;
  iteration: number;
} {
  let nonce: string | undefined;
  let salt: string | undefined;
  let iteration: number | undefined;

  String(data)
    .split(',')
    .forEach((part) => {
      switch (part[0]) {
        case 'r':
          nonce = part.substr(2);
          break;
        case 's':
          salt = part.substr(2);
          break;
        case 'i':
          iteration = parseInt(part.substr(2), 10);
          break;
      }
    });

  if (!nonce) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing');
  }

  if (!salt) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing');
  }

  if (!iteration) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing');
  }

  return {
    nonce,
    salt,
    iteration,
  };
}

/* tslint:disable:no-bitwise */
function xorBuffers(a: Buffer, b: Buffer): Buffer {
  if (!Buffer.isBuffer(a)) a = Buffer.from(a);
  if (!Buffer.isBuffer(b)) b = Buffer.from(b);
  const res = [];
  if (a.length > b.length) {
    for (let i = 0; i < b.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  } else {
    for (let j = 0; j < a.length; j++) {
      res.push(a[j] ^ b[j]);
    }
  }
  return Buffer.from(res);
}
/* tslint:enable:no-bitwise */
function createHMAC(key: Buffer, msg: string | Buffer) {
  return crypto.createHmac('sha256', key).update(msg).digest();
}

function Hi(password: Buffer, saltBytes: Buffer, iterations: number) {
  let ui1 = createHMAC(
    password,
    Buffer.concat([saltBytes, Buffer.from([0, 0, 0, 1])]),
  );
  let ui = ui1;
  for (let i = 0; i < iterations - 1; i++) {
    ui1 = createHMAC(password, ui1);
    ui = xorBuffers(ui, ui1);
  }

  return ui;
}

function isBase64(text: string) {
  return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(
    text,
  );
}

function parseAttributePairs(text: string) {
  return new Map(
    text
      .split(',')
      .filter((attrValue) => /^.=./.test(attrValue))
      .map((attrValue) => {
        const name = attrValue[0];
        const value = attrValue.substring(2);
        return [name, value];
      }),
  );
}
