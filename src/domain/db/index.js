import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const connectToDB = async () => {
	try {
		await prisma.$connect();
		console.log("Connected to PostgreSQL");
	} catch (error) {
		console.log("Error occured while connecting to db : ", error.message);
        throw error;
	}
};

export default prisma;
