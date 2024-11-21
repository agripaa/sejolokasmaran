const express = require('express');
const authRoutes = require('./auth.route');
const roleRoutes = require('./roles.route');
const relationTypeRoutes = require('./relationType.route');
const otpRoutes = require('./otpCode.route');
const userRoutes = require('./user.route');
const pregnancyJournalRoutes = require('./pregnancyJournal.route');
const trimesterRoutes = require('./trimester.route');
const listJournalRoutes = require('./listJournal.route');
const checkedRoutes = require('./checked.route');
const learnListRoutes = require('./learnList.route');
const learnCategoryRoutes = require('./learnCategory.route');
const listClassRoutes = require('./listClass.route');
const detailClassRoutes = require('./detailClass.route');
const subjectRoutes = require('./subject.route');
const postingRoutes = require('./posting.route');
const commentRoutes = require('./comment.route');
const likeRoutes = require('./like.route');
const newsRoutes = require('./news.route');
const authorRoutes = require('./author.route');
const newsContentRoutes = require('./newsContent.route');

const router = express.Router();

router.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept',
    );
    next();
});

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/relation_type', relationTypeRoutes);
router.use('/otp', otpRoutes);
router.use('/user', userRoutes);
router.use('/pregnancy_journal', pregnancyJournalRoutes);
router.use('/trimester', trimesterRoutes);
router.use('/list_journal', listJournalRoutes);
router.use('/checked', checkedRoutes);
router.use('/learn_list', learnListRoutes);
router.use('/learn_category', learnCategoryRoutes);
router.use('/list_class', listClassRoutes);
router.use('/detail_class', detailClassRoutes);
router.use('/subject', subjectRoutes);
router.use('/posting', postingRoutes);
router.use('/comment', commentRoutes);
router.use('/like', likeRoutes);
router.use('/news', newsRoutes);
router.use('/author', authorRoutes);
router.use('/news_content', newsContentRoutes);

module.exports = router;