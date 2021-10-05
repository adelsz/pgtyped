import {
  checkServerFinalMessage,
  createClientSASLContinueResponse,
  createInitialSASLResponse,
} from './sasl-helpers';

test('createInitialSASLResponse', () => {
  const { clientNonce, response } = createInitialSASLResponse();
  expect(clientNonce.length).toEqual(24);
  expect(response).toMatch(/^n,,n=\*,r=.{24}/);
});

test('createInitialSASLResponse creates random nonces', () => {
  const { clientNonce: nonce1 } = createInitialSASLResponse();
  const { clientNonce: nonce2 } = createInitialSASLResponse();
  expect(nonce1).not.toEqual(nonce2);
});

test('createClientSASLContinueResponse to fail when not giving it correct SASLData', () => {
  expect(() => createClientSASLContinueResponse('', '', '')).toThrowError();
});
test('createClientSASLContinueResponse to fail when nonce is missing in SASLData', () => {
  expect(() =>
    createClientSASLContinueResponse('', '', 's=1,i=1'),
  ).toThrowError('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing');
});
test('createClientSASLContinueResponse to fail when salt is missing in SASLata', () => {
  expect(() =>
    createClientSASLContinueResponse('', '', 'r=1,i=1'),
  ).toThrowError('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing');
});
test('createClientSASLContinueResponse to fail when iteration is missing in SASLata', () => {
  expect(() =>
    createClientSASLContinueResponse('', '', 'r=1,s=abcd'),
  ).toThrowError('SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing');
});
test('createClientSASLContinueResponse to fail when SASLData does not contain client nonce in server nonce', () => {
  expect(() =>
    createClientSASLContinueResponse('password', '2', 'r=1,s=abcd,i=1'),
  ).toThrowError(
    'SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce',
  );
});
test('createClientSASLContinueResponse works as expected', () => {
  const clientNonce = 'a';
  const {
    response,
    calculatedServerSignature,
  } = createClientSASLContinueResponse(
    'password',
    clientNonce,
    'r=ab,s=abcd,i=1',
  );
  expect(response).toEqual(
    'c=biws,r=ab,p=mU8grLfTjDrJer9ITsdHk0igMRDejG10EJPFbIBL3D0=',
  );
  expect(calculatedServerSignature).toEqual(
    'jwt97IHWFn7FEqHykPTxsoQrKGOMXJl/PJyJ1JXTBKc=',
  );
});
test('checkServerFinalMessage is failing when server signature is missing', () => {
  expect(() => checkServerFinalMessage('', 'abcd')).toThrowError(
    'SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing',
  );
});

test('checkServerFinalMessage is failing when server signature is not base64', () => {
  expect(() => checkServerFinalMessage('v=x1', 'abcd')).toThrowError(
    'SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64',
  );
});

test(
  'checkServerFinalMessage is failing when server signature does not match calculated server signature at client' +
    ' side',
  () => {
    expect(() => checkServerFinalMessage('v=xyzq', 'abcd')).toThrowError(
      'SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match',
    );
  },
);

test('checkServerFinalMessage does not throw an error when it should suppose to work', () => {
  expect(() => checkServerFinalMessage('v=abcd', 'abcd')).not.toThrowError();
});
