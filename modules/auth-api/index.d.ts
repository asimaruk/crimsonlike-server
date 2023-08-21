export interface AuthPlatform {

    verify(token: string): Promise<string>
}