import { Router } from "express";
import { addUser, getAllUsers } from "../../application/controllers/user.controllers.js";
import { addTask, getTasks, updateTaskStatus } from "../../application/controllers/task.controllers.js";
import { convertToExcel } from "../utils/convertToExcel.js";

const router = Router();

router.route("/addUser").post(addUser);
router.route("/getAllUsers").get(getAllUsers);


router.route("/addTask").post(addTask);
router.route("/getTasks").get(getTasks);
router.route(`/updateTaskStatus/:id`).post(updateTaskStatus);


router.route("/export").get(convertToExcel);


export default router;
