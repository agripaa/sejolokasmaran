const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const { Op } = require('sequelize')
const { scheduleEmailsForUser } = require('./controllers/emailSender.controller');
const User = require('./models/User'); 

require('dotenv').config();
require('./models/migration');

const app = express();

app.use(cors({ 
    origin: "http://127.0.0.1:5500",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

(async () => {
    try {
        const users = await User.findAll({
            where: { born_date: { [Op.ne]: null } } 
        });

        users.forEach(user => {
            scheduleEmailsForUser(user.born_date, user.id, user.email);
        });

        console.log('Scheduler dijalankan untuk semua pengguna.');
    } catch (error) {
        console.error('Gagal menjalankan scheduler:', error.message);
    }
})();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', routes);

app.listen(process.env.PORT, () => {
    console.log(`Server berjalan di http://localhost:${process.env.PORT}`);
});
