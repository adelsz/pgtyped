import {
  byte1,
  byte4,
  byteN,
  cByteDict,
  cString,
  cStringDict,
  fixedArray,
  int16,
  int32,
} from './helpers';

export interface IClientMessage<Params extends object | void> {
  name: string;
  type: 'CLIENT';
  indicator: string | null;
  pattern: (params: Params) => Buffer[];
}

type MapFields<Params> = {
  [P in keyof Params]:
    | void
    | (Params[P] extends Array<infer R>
        ? Array<MapFields<R>>
        : (arg: Params[P]) => Buffer);
};

export interface IServerMessage<Params extends object> {
  name: string;
  type: 'SERVER';
  size?: number;
  indicator: string;
  pattern: MapFields<Params>;
}

/** The status of the the server query executor */
export enum TransactionStatus {
  /** Transaction idle (not in a transaction block) */
  Idle = 'I',

  /** In a transaction block */
  Transaction = 'T',

  /** Failed transaction block (queries will be rejected until block is ended) */
  Error = 'E',
}

/** Prepared object type */
export enum PreparedObjectType {
  Portal = 'P',
  Statement = 'S',
}

export const messages = {
  /** SSLRequest message requests SSL from a remote host  */
  sslRequest: {
    name: 'SSLRequest',
    type: 'CLIENT',
    indicator: null,
    pattern: () => [
      // The SSL request code.
      int32(80877103),
    ],
  } as IClientMessage<{}>,
  /** ReadyForQuery message informs the frontend that it can safely send a new command. */
  readyForQuery: {
    name: 'ReadyForQuery',
    type: 'SERVER',
    indicator: 'Z',
    size: 5,
    pattern: {
      trxStatus: byte1,
    },
  } as IServerMessage<{ trxStatus: TransactionStatus }>,
  /** AuthenticationOk message informs the frontend that the authentication exchange is successfully completed. */
  authenticationOk: {
    name: 'AuthenticationOk',
    type: 'SERVER',
    indicator: 'R',
    size: 8,
    pattern: {
      status: int32(0),
    },
  } as IServerMessage<{}>,
  /** AuthenticationCleartextPassword message informs the frontend that it must now send a PasswordMessage containing the password in clear-text form */
  authenticationCleartextPassword: {
    name: 'AuthenticationCleartextPassword',
    type: 'SERVER',
    indicator: 'R',
    size: 8,
    pattern: {
      status: int32(3),
    },
  } as IServerMessage<{}>,
  /** AuthenticationMD5Password message informs the frontend that it must now send a PasswordMessage containing the password in MD5 form */
  authenticationMD5Password: {
    name: 'AuthenticationMD5Password',
    type: 'SERVER',
    indicator: 'R',
    size: 12,
    pattern: {
      status: int32(5),
      salt: byte4,
    },
  } as IServerMessage<{
    /** md5 salt to use */
    salt: Buffer;
  }>,
  /**
   * BackendKeyData message provides secret-key data that the frontend must save to be able to issue cancel requests later.
   * The frontend should not respond to this message, but should continue listening for a ReadyForQuery message.
   */
  backendKeyData: {
    name: 'BackendKeyData',
    type: 'SERVER',
    indicator: 'K',
    size: 12,
    pattern: {
      processId: int32,
      secretKey: int32,
    },
  } as IServerMessage<{
    /** The process ID of the backend. */
    processId: number;
    /** The secret key of the backend. */
    secretKey: number;
  }>,
  /**
   * StartupMessage should be the first message sent by the frontend to initiate an unencrypted connection.
   * To initiate an SSL-encrypted connection first message should be a SSLRequest message
   */
  startupMessage: {
    name: 'StartupMessage',
    type: 'CLIENT',
    indicator: null,
    pattern: (data) => [
      // The protocol version number.
      // The most significant 16 bits are the major version number (3 for the protocol described here).
      // The least significant 16 bits are the minor version number (0 for the protocol described here).
      int32(196608),
      // An array of String parameter-value pairs
      cStringDict(data.params),
    ],
  } as IClientMessage<{
    /**
     * A key-value map of startup parameters.
     * Currently recognized parameters are:
     * - user
     * The database user name to connect as. Required; there is no default.
     * - database
     * The database to connect to. Defaults to the user name.
     * - options
     * Command-line arguments for the backend. (This is deprecated in favor of setting individual run-time parameters.) Spaces within this string are considered to separate arguments, unless escaped with a backslash (\); write \\ to represent a literal backslash.
     * - replication
     * Used to connect in streaming replication mode, where a small set of replication commands can be issued instead of SQL statements. Value can be true, false, or database, and the default is false. See Section 52.4 for details.
     * In addition to the above, other parameters may be listed.
     * Parameter names beginning with _pq_. are reserved for use as protocol extensions, while others are treated as run-time parameters to be set at backend start time.
     * Such settings will be applied during backend start (after parsing the command-line arguments if any) and will act as session defaults.
     */
    params: { [key: string]: string };
  }>,
  /** ParameterStatus message informs the frontend about the current (initial) setting of backend parameters. */
  parameterStatus: {
    name: 'ParameterStatus',
    type: 'SERVER',
    indicator: 'S',
    pattern: {
      name: cString,
      value: cString,
    },
  } as IServerMessage<{
    /** The name of the run-time parameter being reported */
    name: string;
    /** The current value of the parameter */
    value: string;
  }>,
  /** PasswordMessage sends a password response on initial auth. */
  passwordMessage: {
    name: 'PasswordMessage',
    type: 'CLIENT',
    indicator: 'p',
    pattern: (data) => [cString(data.password)],
  } as IClientMessage<{
    /** Password string either plain text or MD5 encrypted */
    password: string;
  }>,
  /** Query message initiates a simple query cycle. */
  query: {
    name: 'Query',
    type: 'CLIENT',
    indicator: 'Q',
    pattern: (data) => [cString(data.query)],
  } as IClientMessage<{
    /** SQL command (or commands) expressed as a text string */
    query: string;
  }>,
  /**
   * RowDescription message indicates that rows are about to be returned in response to a query.
   * The contents of this message describe the column layout of the rows.
   * This will be followed by a DataRow message for each row being returned to the frontend.
   */
  rowDescription: {
    name: 'RowDescription',
    type: 'SERVER',
    indicator: 'T',
    pattern: {
      fields: [
        {
          name: cString,
          tableOID: int32,
          columnAttrNumber: int16,
          typeOID: int32,
          typeSize: int16,
          typeModifier: int32,
          formatCode: int16,
        },
      ],
    },
  } as IServerMessage<{
    fields: Array<{
      /** The field name. */
      name: string;
      /** If the field can be identified as a column of a specific table, the object ID of the table; otherwise zero. */
      tableOID: number;
      /** If the field can be identified as a column of a specific table, the attribute number of the column; otherwise zero. */
      columnAttrNumber: number;
      /** The object ID of the field's data type. */
      typeOID: number;
      /** The data type size (see pg_type.typlen). Note that negative values denote variable-width types. */
      typeSize: number;
      /** The type modifier (see pg_attribute.atttypmod). The meaning of the modifier is type-specific. */
      typeModifier: number;
      /** The format code being used for the field. Currently will be zero (text) or one (binary). In a RowDescription returned from the statement variant of Describe, the format code is not yet known and will always be zero. */
      formatCode: number;
    }>;
  }>,
  /** DataRow message returns one of the set of rows returned by the query */
  dataRow: {
    name: 'DataRow',
    type: 'SERVER',
    indicator: 'D',
    pattern: {
      columns: [
        {
          value: byteN,
        },
      ],
    },
  } as IServerMessage<{
    /** Row columns array */
    columns: Array<{
      /** The value of the column, in the format indicated by the associated format code. n is the above length. */
      value: Buffer;
    }>;
  }>,
  /**
   * No data message is returned when the server has no data to return for the previous client request.
   */
  noData: {
    name: 'NoData',
    type: 'SERVER',
    size: 5,
    indicator: 'n',
    pattern: {},
  } as IServerMessage<{}>,
  /**
   * ParameterDescription message describes the parameters needed by the statement.
   * It is followed by a RowDescription message describing the rows that will be returned (or a NoData message if the statement will not return rows)
   */
  parameterDescription: {
    name: 'ParameterDescription',
    type: 'SERVER',
    indicator: 't',
    pattern: {
      params: [
        {
          oid: int32,
        },
      ],
    },
  } as IServerMessage<{
    /** Array of parameter type OIDS */
    params: Array<{
      /** Specifies the object ID of the parameter data type. */
      oid: number;
    }>;
  }>,
  /**
   * Parse message contains a textual query string, optionally some information about data types of parameter placeholders, and the name of a destination prepared-statement object.
   */
  parse: {
    name: 'Parse',
    type: 'CLIENT',
    indicator: 'P',
    pattern: (params) => [
      cString(params.name),
      cString(params.query),
      fixedArray(({ oid }) => [int32(oid)], params.dataTypes),
    ],
  } as IClientMessage<{
    /** The name of the destination prepared statement (an empty string selects the unnamed prepared statement). */
    name: string;
    /** The query string to be parsed. */
    query: string;
    /** Parameter data types specified (can be empty). Note that this is not an indication of the number of parameters that might appear in the query string, only the number that the frontend wants to prespecify types for. */
    dataTypes: Array<{
      /** Specifies the object ID of the parameter data type. Placing a zero here is equivalent to leaving the type unspecified. */
      oid: number;
    }>;
  }>,
  /** Descibe message asks the server to describe prepared object (by replying with RowDescription and ParameterDescription messages) */
  describe: {
    name: 'Describe',
    type: 'CLIENT',
    indicator: 'D',
    pattern: ({ name, type }) => [byte1(type), cString(name)],
  } as IClientMessage<{
    /** The name of the prepared statement or portal to describe (an empty string selects the unnamed prepared statement or portal). */
    name: string;
    /** 'S' to describe a prepared statement; or 'P' to describe a portal. */
    type: PreparedObjectType;
  }>,
  /** ParseComplete informs the client that prepared object parsing was successful */
  parseComplete: {
    name: 'ParseComplete',
    type: 'SERVER',
    indicator: '1',
    size: 4,
    pattern: {},
  } as IServerMessage<{}>,
  /** Sync message asks the server to return to normal mode after an error */
  sync: {
    name: 'Sync',
    type: 'CLIENT',
    indicator: 'S',
    size: int32(4),
    pattern: () => [],
  } as IClientMessage<{}>,
  /** Flush message asks the server to send all queued messages */
  flush: {
    name: 'Flush',
    type: 'CLIENT',
    indicator: 'H',
    size: int32(4),
    pattern: () => [],
  } as IClientMessage<{}>,
  /** ErrorResponse message is sent by the server when an error has occurred. */
  errorResponse: {
    name: 'ErrorResponse',
    type: 'SERVER',
    indicator: 'E',
    pattern: {
      fields: cByteDict,
    },
  } as IServerMessage<{
    /** Fields describing the error, they can appear in any order. */
    fields: {
      /** PG routine reporting the error */
      R: string;
      /** Error message */
      M: string;
      /** Error hint */
      H?: string;
      /** Error position */
      P?: string;
    };
  }>,
  /**
   * The Close message closes an existing prepared statement or portal and releases resources.
   * The response is normally CloseComplete, but could be ErrorResponse if some difficulty is encountered while releasing resources.
   */
  close: {
    name: 'Close',
    type: 'CLIENT',
    indicator: 'C',
    pattern: (params) => [byte1(params.target), cString(params.targetName)],
  } as IClientMessage<{
    /** 'S' to close a prepared statement; or 'P' to close a portal. */
    target: PreparedObjectType;
    /** The name of the prepared statement or portal to close (an empty string selects the unnamed prepared statement or portal). */
    targetName: string;
  }>,
  /** CloseComplete is sent by the server to signify that the prepared object was successfully close */
  closeComplete: {
    name: 'CloseComplete',
    type: 'SERVER',
    indicator: '3',
    size: 4,
    pattern: {},
  } as IServerMessage<{}>,
  commandComplete: {
    name: 'CommandComplete',
    type: 'SERVER',
    indicator: 'C',
    pattern: {
      /**
       * The command tag. This is usually a single word that identifies which SQL command was completed.
       * For an INSERT command, the tag is INSERT oid rows, where rows is the number of rows inserted. oid is the object ID of the inserted row if rows is 1 and the target table has OIDs; otherwise oid is 0.
       * For a DELETE command, the tag is DELETE rows where rows is the number of rows deleted.
       * For an UPDATE command, the tag is UPDATE rows where rows is the number of rows updated.
       * For a SELECT or CREATE TABLE AS command, the tag is SELECT rows where rows is the number of rows retrieved.
       * For a MOVE command, the tag is MOVE rows where rows is the number of rows the cursor's position has been changed by.
       * For a FETCH command, the tag is FETCH rows where rows is the number of rows that have been retrieved from the cursor.
       * For a COPY command, the tag is COPY rows where rows is the number of rows copied. (Note: the row count appears only in PostgreSQL 8.2 and later.)
       */
      commandTag: cString,
    },
  } as IServerMessage<{ commandTag: string }>,
};

export type TMessage =
  | IServerMessage<{ commandTag: string }>
  | IServerMessage<{
      /** Row columns array */
      columns: Array<{
        /** The value of the column, in the format indicated by the associated format code. n is the above length. */
        value: Buffer;
      }>;
    }>;
