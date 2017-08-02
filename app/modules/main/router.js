'use strict';

const mainRouter = require('express').Router();


const MainController = require('./controllers/MainController');
const mainController = new MainController();


mainRouter.get('/', mainController.mainScreen.bind(mainController));
mainRouter.get('/badge/:user/:package',
    mainController.getImage.bind(mainController));
mainRouter.post('/count', mainController.coundDependencies.bind(mainController));

module.exports = mainRouter;