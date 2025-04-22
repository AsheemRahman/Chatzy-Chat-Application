import { Router } from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {SearchContact} from '../controllers/ContactsController.js'

const contactsRoute = Router();

contactsRoute.post("/search",verifyToken,SearchContact)


export default contactsRoute