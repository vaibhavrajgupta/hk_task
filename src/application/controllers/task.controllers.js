import prisma from "../../domain/db/index.js";
import { asyncHandler } from "../../infrastructure/utils/asyncHandler.js";
import { ApiError } from "../../infrastructure/utils/ApiError.js";
import { ApiResponse } from "../../infrastructure/utils/ApiResponse.js";
import { getAllUsers } from "./user.controllers.js";

export const addTask = asyncHandler(async (req, res) => {
	// const users = getAllUsers();
	// console.log(users);
	const { userId, name, type, status } = req.body;
	try {
		const user = await prisma.user.findUnique({
			where: { id: Number(userId) },
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const task = await prisma.task.create({
			data: {
				name,
				type,
				status,
				user: { connect: { id: userId } },
			},
		});

		await prisma.user.update({
			where: { id: userId },
			data: { tasks: { connect: { id: task.id } } },
		});

		const taskWithStrings = {
			...task,
			userId: task.userId.toString(),
			id: task.id.toString(),
		};

		res
			.status(201)
			.json({ message: "Task assigned successfully", task: taskWithStrings });
	} catch (error) {
		console.error("Error assigning task:", error);
		res.status(500).json({ error: "Error assigning task" });
	}
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
	const taskId = req.params.id;
	const { status } = req.body;

	try {
		const task = await prisma.task.findUnique({
			where: { id: Number(taskId) },
		});

		if (!task) {
			res.status(404).json({ error: "Task not found" });
			return;
		}

		const updatedTask = await prisma.task.update({
			where: { id: Number(taskId) },
			data: { status },
		});

		res
			.status(200)
			.json({ message: "Task status updated successfully", task: updatedTask });
	} catch (error) {
		console.error("Error updating task status:", error);
		res.status(500).json({ error: "Error updating task status" });
	}
});

export const getTasks = asyncHandler(async (req, res) => {
	try {
		const fetchedTasks = await prisma.task.findMany();
		const tasks = fetchedTasks.map((task) => ({
			...task,
			id: String(task.id),
			usersId: String(task.userId),
		}));
		return res.status(200).json(new ApiResponse(200, tasks, "Tasks Fetched Successfully"));
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
