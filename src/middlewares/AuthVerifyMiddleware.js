const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-this-secret';

module.exports = (req, res, next) => {
    const Token = req.headers['token'];

    if (!Token) {
        return res.status(401).json({ status: 'unauthorized' });
    }

    jwt.verify(Token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded?.data) {
            return res.status(401).json({ status: 'unauthorized' });
        }

        req.headers.email = decoded.data;
        next();
    });
};
