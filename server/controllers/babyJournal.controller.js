const CategoryJournal = require('../models/CategoryJournal');
const ListJournal = require('../models/ListJournal');
const PregnancyJournal = require('../models/PregnancyJournal');
const Trimester = require('../models/Trimester');
const User = require('../models/User');
const { scheduleEmailsForUser } = require('./emailSender.controller'); // Import fungsi dari emailSender

module.exports = {
    getAllBaby: async function(req, res) {
        try {
            const baby_journals = await PregnancyJournal.findAll({
                include: [Trimester, ListJournal, CategoryJournal],
                where: { cat_journal_id: 1 }
            });
            if (baby_journals.length === 0) {
                return res.status(404).json({ status: 404, msg: "Pregnancy Journal is null" });
            }

            res.status(200).json({ status: 200, result: baby_journals });
        } catch (error) {
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },

    getBabyById: async function(req, res) {
        const { id } = req.params;
        try {
            const baby_journal = await PregnancyJournal.findOne({
                where: { id },
                include: [Trimester, CategoryJournal],
                where: { cat_journal_id: 1 }
            });
            if (!baby_journal) {
                return res.status(404).json({ status: 404, msg: "Pregnancy Journal is not defined!" });
            }

            res.status(200).json({ status: 200, result: baby_journal });
        } catch (error) {
            res.status(500).json({ error: 'Error Pregnancy Journal', details: error });
        }
    },

    getBabyByTrimester: async function(req, res) {
        try {
            const trimesters = await Trimester.findAll({
                include: [
                    {
                        model: PregnancyJournal,
                        include: [ListJournal],
                        where: { cat_journal_id: 1 }
                    },
                ],
            });

            const filteredTrimesters = trimesters.filter(
                (trimester) => trimester.PregnancyJournals && trimester.PregnancyJournals.length > 0
            );

            if (filteredTrimesters.length === 0) {
                return res.status(404).json({ status: 404, msg: "No data found!" });
            }

            res.status(200).json({ status: 200, result: filteredTrimesters });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, msg: "Error fetching data", details: error });
        }
    },

    upBornDate: async function (req, res) {
        const { born_date } = req.body;
        const { userId } = req;

        try {
            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                return res.status(404).json({ msg: 'User tidak ditemukan' });
            }

            await User.update({ born_date }, { where: { id: userId } });

            // Panggil scheduler setelah born_date diperbarui
            scheduleEmailsForUser(born_date, user.id, user.email);

            res.status(200).json({ msg: 'Born date updated and scheduler started.' });
        } catch (error) {
            console.error('Error updating born date:', error.message);
            res.status(500).json({ msg: 'Error updating born date', details: error });
        }
    },
};
