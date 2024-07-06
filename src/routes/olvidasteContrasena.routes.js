import { Router } from 'express';
import { solicitarCambioContrasena, verificarCodigo, cambiarContrasenaConCodigo } from '../controllers/olvidasteContrasenaController.js';

const olvidePassword = Router();

olvidePassword.post('/solicitarCambioContrasena', solicitarCambioContrasena);
olvidePassword.post('/verificarCodigo', verificarCodigo);
olvidePassword.put('/cambiarContrasenaConCodigo', cambiarContrasenaConCodigo);

export default olvidePassword;
