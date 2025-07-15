import { Role } from "../../definitions/types";
export default class User {
    getRoles: () => Promise<Role[]>;
    getRoleById: (id: number) => Promise<Role>;
    newRole: (role: string) => Promise<{
        success: string;
    }>;
    editRole: (id: number, role: string, status: number) => Promise<{
        success: string;
    }>;
    deactivateRole: (id: number) => Promise<{
        success: string;
    }>;
    getUsers: () => Promise<{
        status: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        userRole: {
            role: string;
            id: number;
        };
    }[]>;
    getUserByUsername: (username: string) => Promise<{
        id: string;
        username: string;
        password: string;
        idRole: number;
    }>;
    getUserById: (id: string) => Promise<{
        status: number;
        id: string;
        username: string;
        userRole: {
            role: string;
            id: number;
        };
    }>;
    newUser: (username: string, password: string, idRole: number) => Promise<{
        success: string;
    }>;
    editUser: (id: string, username: string, idRole: number) => Promise<{
        success: string;
    }>;
    activateUser: (id: string) => Promise<{
        success: string;
    }>;
    deactivateUser: (id: string) => Promise<{
        success: string;
    }>;
    changePassword: (id: string, oldPassword: string, password: string) => Promise<{
        success: string;
    }>;
}
