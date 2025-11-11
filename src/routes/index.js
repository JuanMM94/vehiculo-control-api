import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import vehiculoRoutes from './vehiculoRoutes.js';
import mantenimientoRoutes from './mantenimientoRoutes.js';
import estadoVehiculoRoutes from './estadoVehiculoRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Control de Vehículos',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      vehiculos: '/api/vehiculos',
      mantenimientos: '/api/mantenimientos',
      historialEstados: '/api/estados',
    },
    documentacion: 'Ver README.md para instrucciones de uso',
  });
});

router.use('/usuarios', usuarioRoutes);
router.use('/vehiculos', vehiculoRoutes);
router.use('/mantenimientos', mantenimientoRoutes);
router.use('/estados', estadoVehiculoRoutes);

export default router;
