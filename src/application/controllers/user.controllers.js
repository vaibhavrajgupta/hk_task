import prisma from "../../domain/db/index.js";
import { asyncHandler } from "../../infrastructure/utils/asyncHandler.js";
import { ApiError } from "../../infrastructure/utils/ApiError.js";
import { ApiResponse } from "../../infrastructure/utils/ApiResponse.js";
import { validateEmail } from "../../infrastructure/utils/validation.js";
import { validateNumber } from "../../infrastructure/utils/validation.js";
import { getUserByEmail } from "../../infrastructure/utils/validation.js";

export const addUser = asyncHandler(async (req, res) => {
	try {
		const { name, mobile, email } = req.body;
		if ([name, mobile, email].some((field) => field?.trim() === "")) {
			throw new ApiError(400, "All fields are required");
		}

		if (!validateEmail(email)) throw new ApiError(400, "Email is not correct");
		if (!validateNumber(mobile))
			throw new ApiError(400, "Mobile is not correct");

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			throw new ApiError(409, "User registered");
		}

		await prisma.user.create({
			data: { name, mobile, email },
		});

		const user = await getUserByEmail(email);
		if (!user) {
			throw new ApiError(500, "Something went wrong while creating the user");
		}
		const createdUser = {name, mobile, email}
		return res
			.status(201)
			.json({data : new ApiResponse(200),user : createdUser,message: "User registered Successfully"});
	} catch (error) {
		console.log(error);
		res.status(error.statusCode || 500).json({
			status: error.statusCode || 500,
			data: null,
			errors: [error.message || "Internal Server Error"],
			success: false,
		});
	}
});

export const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const fetchedUsers = await prisma.user.findMany();
		const users = fetchedUsers.map((user) => ({
			...user,
			id: String(user.id),
			mobile: String(user.mobile),
		}));
		res.status(200).json(new ApiResponse(200, users, "Users Fetched SuccessFully"));
	} catch (error) {
		console.log(error);
		res.status(error.statusCode || 500).json({
			status: error.statusCode || 500,
			data: null,
			errors: [error.message || "Internal Server Error"],
			success: false,
		});
	}
});
