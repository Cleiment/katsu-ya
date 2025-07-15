export default class Auth {
    createToken: (id: string, username: string, idRole: number) => Promise<string>;
    checkToken: (token: string) => Promise<{
        status: number;
        id: string;
        username: string;
        userRole: {
            role: string;
            id: number;
        };
    }>;
    login: (username: string, password: string) => Promise<{
        token: string;
    }>;
}
