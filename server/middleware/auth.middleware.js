const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ status: 403,msg: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401,msg: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        req.roleId = decoded.role_id;
        next();
    });
};

module.exports = verifyToken;
