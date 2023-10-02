const jwt = require('jsonwebtoken');
const userModels = require('../dao/models/userModels');
const { isValidPassword } = require('../utils/passwordHash');
const roles = require('../config/roles');

module.exports = async (email, password) => {
    try {
        const user = await userModels.findOne({ email: email });

        if (!user || !isValidPassword(password, user.password)) {
            return null; // Autenticación fallida
        }

        // Genera un JWT con la información del usuario
        const payload = {
            userId: user._id,
            email: user.email,
            // Puedes incluir otros datos relevantes aquí
            role: user.role,
        };

        // Crea y firma el JWT
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

        return token; // Devuelve el JWT al cliente
    } catch (error) {
        throw error;
    }
};