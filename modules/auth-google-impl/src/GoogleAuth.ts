import { AuthPlatform } from "auth-api";
import { OAuth2Client } from "google-auth-library";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class GoogleAuth implements AuthPlatform {

    private client = new OAuth2Client();

    async verify(token: string): Promise<string> {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            throw new Error('No GOOGLE_CLIENT_ID env variable specified')
        }
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            // TODO: do not commit with client id, move to config
            audience: [clientId],
        });
        const payload = ticket.getPayload();
        const userid = payload?.['sub'];

        return new Promise((resolve, reject) => {
            if (userid) {
                resolve(userid);
            } else {
                reject(new Error(`Google verification failed, token ${token}`));
            }
        });
    }
}