import { Router } from "express"
import { sendQuestion } from "./controllers/name-controller"


const router = Router()


router.post("/chat", sendQuestion)



export default router