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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: number;
        username: string;
        userRole: {
            id: number;
            role: string;
        };
    }[]>;
    getUserByUsername: (username: string) => Promise<{
        id: string;
        username: string;
        password: string;
        idRole: number;
    }>;
    getUserById: (id: string) => Promise<{
        id: string;
        status: number;
        username: string;
        userRole: {
            id: number;
            role: string;
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
