export declare function createInitialSASLResponse(): {
    response: string;
    clientNonce: string;
};
export declare function createClientSASLContinueResponse(password: string, clientNonce: string, SASLData: string): {
    response: string;
    calculatedServerSignature: string;
};
export declare function checkServerFinalMessage(serverData: string, calculatedServerSignature: string): void;
