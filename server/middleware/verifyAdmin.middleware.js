const Roles = require('../models/Roles');
const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.userId },
            include: [Roles],
        });

        if (!user || user.Roles.role_name !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

module.exports = verifyAdmin;