const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');

require('dotenv').config();
require('./models/migration');

const app = express();

app.use(cors({ 
    origin: "http://127.0.0.1:5500",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
