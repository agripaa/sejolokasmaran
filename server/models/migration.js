const db = require('../config/database');

const User = require('./User');
const Roles = require('./Roles');
const RelationType = require('./RelationType');
const PregnancyJournal = require('./PregnancyJournal');
const Trimester = require('./Trimester');
const ListJournal = require('./ListJournal');
const LearnList = require('./LearnList');
const LearnCategory = require('./LearnCategory');
const ListClass = require('./ListClass');
const DetailClass = require('./DetailClass');
const Subject = require('./Subject');
const Posting = require('./Posting');
const Likes = require('./Likes');
const Comment = require('./Comment');
const ClassYoga = require('./ClassYoga');
const OtpCode = require('./OtpCode');
const Checked = require('./Checked');
const News = require('./News');
const NewsContent = require('./NewsContent');
const Author = require('./Author');
const CategoryJournal = require('./CategoryJournal');
const EmailLog = require('./EmailLog');

db.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
});

module.exports = db;