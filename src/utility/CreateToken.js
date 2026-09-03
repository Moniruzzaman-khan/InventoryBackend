const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-this-secret';

const CreateToken = async (data) => {
    const Payload = {
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        data
    };
    return jwt.sign(Payload, JWT_SECRET);
};

module.exports = CreateToken;
