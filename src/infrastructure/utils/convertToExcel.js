import prisma from "../../domain/db/index.js";
import Excel from "exceljs";
import { writeFile } from 'fs/promises';

// import { Workbook, Worksheet } from "exceljs";
import pkg from 'exceljs';
const { Workbook, Worksheet } = pkg;
import { asyncHandler } from "./asyncHandler.js";

export const convertToExcel = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany();
	const workbook = new Workbook();
	const usersWorksheet = workbook.addWorksheet("Users");
	const tasksWorksheet = workbook.addWorksheet("Tasks");

	const userHeaders = Object.keys(users[0]).filter((key) => key !== "tasks");
	usersWorksheet.addRow(userHeaders);
	users.forEach((user) => {
		usersWorksheet.addRow(
			Object.values(user).filter(
				(value, index) => userHeaders[index] !== "tasks"
			)
		);
	});

	const taskHeaders = Object.keys(users[0].tasks[0]).filter(
		(key) => key !== "user"
	);
	tasksWorksheet.addRow(taskHeaders);
	users.forEach((user) => {
		user.tasks.forEach((task) => {
			tasksWorksheet.addRow(
				Object.values(task).filter(
					(value, index) => taskHeaders[index] !== "user"
				)
			);
		});
	});

	await writeFile("output.xlsx", await workbook.xlsx.writeBuffer());
});
