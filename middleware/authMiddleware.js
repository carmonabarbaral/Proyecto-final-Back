const jwt = require('jsonwebtoken');
const { roles } = require('../config/roles');

const AuthorizationMiddleware = () => {
    return async (req, res, next) => {
        // Verifica si el encabezado 'authorization' está presente
        if (!req.headers['authorization']) {
            return res.status(401).send('Token de autorización no proporcionado');
        }

        // Valida el token JWT
        const token = req.headers['authorization'].replace('Bearer ', '');
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        // Obtiene el rol del usuario
        const role = decoded.role;

        // Compara el rol del usuario con las reglas de autorización
        const allowed = roles[req.url];
        if (!allowed || allowed.indexOf(role) === -1) {
            return res.status(403).send('No tienes permiso para acceder a este recurso');
        }

        // Continúa con la solicitud
        next();
    };
};

module.exports = AuthorizationMiddleware;

  