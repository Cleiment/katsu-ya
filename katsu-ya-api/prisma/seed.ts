import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const main = async () => {
    await prisma.userRole.createMany({
        data: [
            { role: "ADMIN" },
            { role: "MANAGER" },
            { role: "CASHIER" },
            { role: "KITCHEN" },
            { role: "GUEST" },
        ],
    })

    await prisma.user.createMany({
        data: [
            {
                username: "admin",
                password:
                    "$2b$10$GI6gl1i9OTXtu8mdfu8mJenLqezqbzN9n.FYtDPScCoVyz7eGgVGK",
                idRole: 1,
            },
            {
                username: "manager",
                password:
                    "$2b$10$/IeHxVTq48M/6awrmmdybuj2.V1LtYqRGZGX4QTF1aqSriPzoH9Va",
                idRole: 2,
            },
            {
                username: "cashier",
                password:
                    "$2b$10$ljlCV8x4lFD9wSXYZ2MHGuVcXizGLb/h7LStp4fdJUtS/RBc2BS7S",
                idRole: 3,
            },
            {
                username: "kitchen",
                password:
                    "$2b$10$pc1RZdfw9tes6tFmAZAqdetxD8p8yc7AU7N22sLo3Z/X9aR1jdmv2",
                idRole: 4,
            },
        ],
    })

    await prisma.table.createMany({
        data: [
            { tableName: "Table 1", isOccupied: 0 },
            { tableName: "Table 2", isOccupied: 0 },
            { tableName: "Table 3", isOccupied: 0 },
            { tableName: "Table 4", isOccupied: 0 },
            { tableName: "Table 5", isOccupied: 0 },
            { tableName: "Table 6", isOccupied: 0 },
        ],
    })
}

main()
    .then(async () => {
        console.log("DB has been seeded succesfuly")
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
