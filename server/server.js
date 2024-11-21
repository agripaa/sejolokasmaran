const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const routes = require('./routes/routes');

require('./models/migration');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/api/v1', routes);

app.listen(process.env.PORT, () => {
    console.log(`This server listen on http:localhost:${process.env.PORT}`);
});