import { byte1, byte4, byteN, cByteDict, cString, cStringDict, cStringUnknownLengthArray, fixedArray, int16, int32, notNullTerminatedString, } from './helpers.js';
/** The status of the the server query executor */
export var TransactionStatus;
(function (TransactionStatus) {
    /** Transaction idle (not in a transaction block) */
    TransactionStatus["Idle"] = "I";
    /** In a transaction block */
    TransactionStatus["Transaction"] = "T";
    /** Failed transaction block (queries will be rejected until block is ended) */
    TransactionStatus["Error"] = "E";
})(TransactionStatus || (TransactionStatus = {}));
/** Prepared object type */
export var PreparedObjectType;
(function (PreparedObjectType) {
    PreparedObjectType["Portal"] = "P";
    PreparedObjectType["Statement"] = "S";
})(PreparedObjectType || (PreparedObjectType = {}));
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
    },
    /** ReadyForQuery message informs the frontend that it can safely send a new command. */
    readyForQuery: {
        name: 'ReadyForQuery',
        type: 'SERVER',
        indicator: 'Z',
        size: 5,
        pattern: {
            trxStatus: byte1,
        },
    },
    /** AuthenticationOk message informs the frontend that the authentication exchange is successfully completed. */
    authenticationOk: {
        name: 'AuthenticationOk',
        type: 'SERVER',
        indicator: 'R',
        size: 8,
        pattern: {
            status: int32(0),
        },
    },
    /** AuthenticationCleartextPassword message informs the frontend that it must now send a PasswordMessage containing the password in clear-text form */
    authenticationCleartextPassword: {
        name: 'AuthenticationCleartextPassword',
        type: 'SERVER',
        indicator: 'R',
        size: 8,
        pattern: {
            status: int32(3),
        },
    },
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
    },
    /** AuthenticationSASL message informs the frontend that we must set up a SASL connection */
    authenticationSASL: {
        name: 'AuthenticationSASL',
        type: 'SERVER',
        indicator: 'R',
        pattern: {
            status: int32(10),
            SASLMechanisms: cStringUnknownLengthArray,
        },
    },
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
    },
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
    },
    /** ParameterStatus message informs the frontend about the current (initial) setting of backend parameters. */
    parameterStatus: {
        name: 'ParameterStatus',
        type: 'SERVER',
        indicator: 'S',
        pattern: {
            name: cString,
            value: cString,
        },
    },
    /** SASLInitialResponse gives the server the selected SASL mechanism and the initial client response */
    SASLInitialResponse: {
        name: 'SASLInitialResponse',
        type: 'CLIENT',
        indicator: 'p',
        pattern: (data) => [
            cString(data.mechanism),
            int32(data.responseLength),
            notNullTerminatedString(data.response),
        ],
    },
    /**
     * AuthenticationSASLContinue gives the client specific data for the SCRAM method, such as the nonce salt
     *  and the number of iterations for the chosen hash function.
     */
    AuthenticationSASLContinue: {
        name: 'AuthenticationSASLContinue',
        type: 'SERVER',
        indicator: 'R',
        pattern: {
            status: int32(11),
            SASLData: notNullTerminatedString,
        },
    },
    /**
     * Now the right hash function is known, the client can send back a hashed password using the SASLResponse message
     */
    SASLResponse: {
        name: 'SASLResponse',
        type: 'CLIENT',
        indicator: 'p',
        pattern: (data) => [notNullTerminatedString(data.response)],
    },
    /** The AuthenticationSASLFinal message is sent when the password is correct and it returns a server signature
     *  that can be verified on the client.
     */
    authenticationSASLFinal: {
        name: 'AuthenticationSASLFinal',
        type: 'SERVER',
        indicator: 'R',
        pattern: {
            status: int32(12),
            SASLData: notNullTerminatedString,
        },
    },
    /** PasswordMessage sends a password response on initial auth. */
    passwordMessage: {
        name: 'PasswordMessage',
        type: 'CLIENT',
        indicator: 'p',
        pattern: (data) => [cString(data.password)],
    },
    /** Query message initiates a simple query cycle. */
    query: {
        name: 'Query',
        type: 'CLIENT',
        indicator: 'Q',
        pattern: (data) => [cString(data.query)],
    },
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
    },
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
    },
    /**
     * No data message is returned when the server has no data to return for the previous client request.
     */
    noData: {
        name: 'NoData',
        type: 'SERVER',
        size: 5,
        indicator: 'n',
        pattern: {},
    },
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
    },
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
    },
    /** Descibe message asks the server to describe prepared object (by replying with RowDescription and ParameterDescription messages) */
    describe: {
        name: 'Describe',
        type: 'CLIENT',
        indicator: 'D',
        pattern: ({ name, type }) => [byte1(type), cString(name)],
    },
    /** ParseComplete informs the client that prepared object parsing was successful */
    parseComplete: {
        name: 'ParseComplete',
        type: 'SERVER',
        indicator: '1',
        size: 4,
        pattern: {},
    },
    /** Sync message asks the server to return to normal mode after an error */
    sync: {
        name: 'Sync',
        type: 'CLIENT',
        indicator: 'S',
        size: int32(4),
        pattern: () => [],
    },
    /** Flush message asks the server to send all queued messages */
    flush: {
        name: 'Flush',
        type: 'CLIENT',
        indicator: 'H',
        size: int32(4),
        pattern: () => [],
    },
    /** ErrorResponse message is sent by the server when an error has occurred. */
    errorResponse: {
        name: 'ErrorResponse',
        type: 'SERVER',
        indicator: 'E',
        pattern: {
            fields: cByteDict,
        },
    },
    /**
     * The Close message closes an existing prepared statement or portal and releases resources.
     * The response is normally CloseComplete, but could be ErrorResponse if some difficulty is encountered while releasing resources.
     */
    close: {
        name: 'Close',
        type: 'CLIENT',
        indicator: 'C',
        pattern: (params) => [byte1(params.target), cString(params.targetName)],
    },
    /** CloseComplete is sent by the server to signify that the prepared object was successfully close */
    closeComplete: {
        name: 'CloseComplete',
        type: 'SERVER',
        indicator: '3',
        size: 4,
        pattern: {},
    },
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
    },
};
//# sourceMappingURL=messages.js.map