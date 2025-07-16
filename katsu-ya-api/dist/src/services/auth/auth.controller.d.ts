export default class Auth {
    createToken: (id: string, username: string, idRole: number) => Promise<string>;
    checkToken: (token: string) => Promise<{
        id: string;
        status: number;
        username: string;
        userRole: {
            id: number;
            role: string;
        };
    }>;
    login: (username: string, password: string) => Promise<{
        token: string;
    }>;
}
