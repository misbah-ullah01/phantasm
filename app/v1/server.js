const express = require('express');
const app = express();
const PORT = process.env.port || 3001;
const VERSION = process.env.APP_VERSION || 'v1.0';

let requestCount = 0;

app.use((req, res, next) => {
    requestCount++;
    console.log()
})