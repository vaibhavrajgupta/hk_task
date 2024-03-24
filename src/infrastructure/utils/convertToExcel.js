import prisma from "../../domain/db/index.js";
import exceljs from "exceljs";
import fs from "fs";

import { asyncHandler } from "./asyncHandler.js";

export const convertToExcel = asyncHandler(async (req, res) => {
	try {
		const workbook = new exceljs.Workbook();

	const worksheetUser = workbook.addWorksheet("Users");
	const worksheetTask = workbook.addWorksheet("Tasks");

	const users = await prisma.user.findMany({
		include: {
			tasks: true,
		},
	});

	worksheetUser.columns = [
		{ header: "ID", key: "id", width: 10 },
		{ header: "Name", key: "name", width: 25 },
		{ header: "Mobile", key: "mobile", width: 15 },
		{ header: "Email", key: "email", width: 25 },
	];

	users.forEach((user) => {
		worksheetUser.addRow({
			id: user.id,
			name: user.name,
			mobile: user.mobile,
			email: user.email,
		});
	});

	worksheetTask.columns = [
		{ header: "ID", key: "id", width: 10 },
		{ header: "Name", key: "name", width: 25 },
		{ header: "Type", key: "type", width: 15 },
		{ header: "Status", key: "status", width: 15 },
		{ header: "UserID", key: "userId", width: 15 },
	];

	users.forEach((user) => {
		user.tasks.forEach((task) => {
			worksheetTask.addRow({
				id: task.id,
				name: task.name,
				type: task.type,
				status: task.status,
				userId: user.id,
			});
		});
	});

	const filename = "exported_data.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Create a readable stream from the created file
    const fileStream = fs.createReadStream(filename);

    // Set the appropriate headers for the response
    // res.send("Excel Sheet created successfully");

    // Pipe the file stream to the response object
    fileStream.pipe(res);
	} catch (error) {
		console.error("Error creating Excel file:", error);
    res.status(500).json({ message: "Error creating Excel file" });
	}
});
