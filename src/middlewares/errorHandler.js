export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      detalles: err.errors.map(e => ({
        campo: e.path,
        mensaje: e.message,
      })),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'El registro ya existe',
      detalles: err.errors.map(e => ({
        campo: e.path,
        mensaje: `El valor para ${e.path} ya está en uso`,
      })),
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Error de integridad referencial',
      mensaje: 'El registro referenciado no existe',
    });
  }

  if (err.message) {
    return res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: 'Error interno del servidor',
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    ruta: req.originalUrl,
  });
};
