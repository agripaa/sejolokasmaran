const RelationType = require('../models/RelationType');
const { Sequelize } = require('sequelize');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
    getUsers: async function(req, res) {
        try {
            const users = await User.findAll();

            res.status(200).json({status: 200, result: users});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error updating user", details: error.message });
        }
    },
    getMonthlyUserCount: async function (req, res) {
        const { year } = req.query;

        try {
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;

            const monthlyData = await User.findAll({
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                    [Sequelize.fn('COUNT', '*'), 'count']
                ],
                where: {
                    createdAt: {
                        [Sequelize.Op.between]: [startDate, endDate]
                    }
                },
                group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
                order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']]
            });

            const monthlyCounts = Array(12).fill(0);
            monthlyData.forEach(item => {
                const monthIndex = item.dataValues.month - 1; 
                monthlyCounts[monthIndex] = item.dataValues.count;
            });

            res.status(200).json({ status: 200, data: monthlyCounts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching monthly user count", details: error.message });
        }
    },
    updateUsers: async function (req, res) {
        const { userId } = req;
        const { 
            username,
            husband_name, 
            wife_name, 
            email, 
            password, 
            confPassword,
            phone, 
            address, 
            date_birth, 
            relation_types 
        } = req.body;

        if (!phone || !address || !date_birth) {
            return res.status(401).json({ status: 401, msg: "This field is required!" });
        }

        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ status: 404, msg: "User data not found!" });
            }

            if (password || confPassword) {
                if (!password || !confPassword) {
                    return res.status(400).json({ status: 400, msg: "Password or confirm password is missing!" });
                }
                if (password !== confPassword) {
                    return res.status(400).json({ status: 400, msg: "Password does not match!" });
                }
            }

            const relationType = await RelationType.findOne({ where: { id: user.relation_types } });
            if (!relationType) {
                return res.status(404).json({ status: 404, msg: "Relation type not found!" });
            }

            let updatedHusbandName = husband_name;
            let updatedWifeName = wife_name;

            if (relationType.name_relation === "SUAMI") {
                updatedHusbandName = null;
            } else if (relationType.name_relation === "ISTRI") {
                updatedWifeName = null;
            }

            let hashedPassword = user.password;
            if (password && confPassword) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            await User.update(
                {
                    username,
                    husband_name: updatedHusbandName,
                    wife_name: updatedWifeName,
                    email,
                    password: hashedPassword,
                    phone,
                    address,
                    date_birth,
                    relation_types,
                },
                { where: { id: userId } }
            );

            res.status(200).json({ status: 200, msg: "User updated successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error updating user", details: error.message });
        }
    },
};
