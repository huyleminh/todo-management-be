import { LoginTicket, OAuth2Client } from "google-auth-library";
import Config from "../../configs/config";

export interface IOAuth2Service {
    verifyToken(idToken: string): Promise<LoginTicket>;
}

export default class OAuth2Service implements IOAuth2Service {
    private _client: OAuth2Client;
    private readonly _clientId = Config.GOOGLE.GOOGLE_AUTH_CLIENT_ID;

    constructor() {
        this._client = new OAuth2Client(this._clientId);
    }

    public verifyToken(idToken: string): Promise<LoginTicket> {
        return this._client.verifyIdToken({
            idToken: idToken,
            audience: this._clientId,
        });
    }
}
