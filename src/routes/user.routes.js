import { Router } from "express";
import{registerUser} from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)

export default router;
//export default router;
// This is a default export. It exports router as the "default" export from the file. When importing, the name doesn't matter, 
//so you can choose any name for it.
