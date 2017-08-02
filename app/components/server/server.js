module.exports = require('./server');

const express = require('express')
const http = require('http')
const path = require('path')
const morgan = require('morgan');

const mainRouter = require('../../modules/main/router');

const app = express();

app.use(morgan('tiny'))

app.use('/img', express.static(path.resolve(__dirname, '../../../public/images/badges')));

app.use('/test', (req, res) => {
    res.send('test');
});

app.use('/', mainRouter)


module.exports = http.createServer(app);