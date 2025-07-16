declare const hostname: string;
declare const port: number;
declare const secret: string;
declare const salt: number;
declare const appMode: string;
declare const tokenExpiredTime: number;
declare const midtransServerKey: string;
declare const clientUrl: string;
export { hostname, port, secret, salt, appMode, tokenExpiredTime, midtransServerKey, clientUrl, };
export declare const Roles: {
    admin: string;
    manager: string;
    cashier: string;
    kitchen: string;
    guest: string;
};
