"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.userRole.createMany({
        data: [
            { role: "ADMIN" },
            { role: "MANAGER" },
            { role: "CASHIER" },
            { role: "KITCHEN" },
            { role: "GUEST" },
        ],
    });
    yield prisma.user.createMany({
        data: [
            {
                username: "admin",
                password: "$2b$10$GI6gl1i9OTXtu8mdfu8mJenLqezqbzN9n.FYtDPScCoVyz7eGgVGK",
                idRole: 1,
            },
            {
                username: "manager",
                password: "$2b$10$/IeHxVTq48M/6awrmmdybuj2.V1LtYqRGZGX4QTF1aqSriPzoH9Va",
                idRole: 2,
            },
            {
                username: "cashier",
                password: "$2b$10$ljlCV8x4lFD9wSXYZ2MHGuVcXizGLb/h7LStp4fdJUtS/RBc2BS7S",
                idRole: 3,
            },
            {
                username: "kitchen",
                password: "$2b$10$pc1RZdfw9tes6tFmAZAqdetxD8p8yc7AU7N22sLo3Z/X9aR1jdmv2",
                idRole: 4,
            },
        ],
    });
    yield prisma.table.createMany({
        data: [
            { tableName: "Table 1", isOccupied: 0 },
            { tableName: "Table 2", isOccupied: 0 },
            { tableName: "Table 3", isOccupied: 0 },
            { tableName: "Table 4", isOccupied: 0 },
            { tableName: "Table 5", isOccupied: 0 },
            { tableName: "Table 6", isOccupied: 0 },
        ],
    });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DB has been seeded succesfuly");
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
