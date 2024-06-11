import { validarUser } from "../controllers/autenticacionController.js";
// verificarUserToken
import { Router } from "express";

const autenticacionRouter = Router()

autenticacionRouter.post('/login', validarUser);
// autenticacionRouter.get("/validate", verificarUserToken)


export default autenticacionRouter;