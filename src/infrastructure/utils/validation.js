import prisma from "../../domain/db/index.js";
import { ApiError } from "./ApiError.js";

export const validateEmail = (email) => {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return regex.test(email);
};

export const validateNumber = (number) => {
	const regex = /^\d{10}$/;
	return regex.test(number);
};

export const getUserByEmail = async (email) => {
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		return user;
	} catch (error) {
		console.error("Error fetching user by email:", error);
		throw new ApiError(500, "Error fetching user by email");
	}
};
