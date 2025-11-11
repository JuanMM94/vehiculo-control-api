import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

router.get('/perfil', authenticate, usuarioController.obtenerPerfil);

router.get('/', authenticate, authorize('Administrador'), usuarioController.obtenerTodos);
router.get('/:id', authenticate, authorize('Administrador'), usuarioController.obtenerPorId);
router.put('/:id', authenticate, authorize('Administrador'), usuarioController.actualizar);
router.delete('/:id', authenticate, authorize('Administrador'), usuarioController.eliminar);

export default router;
