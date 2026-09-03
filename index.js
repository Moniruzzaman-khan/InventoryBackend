const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const router = require('./src/routes/api');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const mongoose = require('mongoose');

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const port = Number(process.env.PORT) || 8080;
const dbUri = process.env.DB_URI;

if (!dbUri) {
    console.error('DB_URI is missing. Create server/.env from server/.env.example.');
    process.exit(1);
}

// Security middleware
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 }));

// Routing
app.use('/api/v1', router);
app.use('*', (req, res) => {
    res.status(404).json({ status: 'fail', data: 'Not Found' });
});

mongoose.connect(dbUri)
    .then(() => {
        console.log(`DB Connected in ${mongoose.connection.host}`);
        app.listen(port, () => console.log(`server running on ${port}`));
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });
