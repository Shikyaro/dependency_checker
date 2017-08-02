'use strict'

const MainView = require('../views/MainView');
const PackageParserService =
    require('../../packageParser/services/PackageParserService');
const PackageCheckerService =
    require('../../packageChecker/services/PackageCheckerService');
const ImageCreatorService =
    require('../../imageCreator/services/ImageCreatorService');
const config = require('../../../../config/config.json');



class MainController {

    constructor() {
        this.mainView = new MainView();
        this.packageParser = new PackageParserService();
        this.packageChecker = new PackageCheckerService();
        this.imageCreator = new ImageCreatorService();
    }

    mainScreen(req, res, next) {
        
        res.send(this.mainView.showFirstScreen());
    }

    getImage(req, res) {
        res.redirect(301, `/img/badge_${req.params.user}_${req.params.package}.png`)
    }

    coundDependencies(req, res) {
        let packageName;
        let userName;
        this.packageParser.requestPackage(req.query.url)
        .then((data) => {
            packageName = data.name;
            userName = data.username;
            return this.packageChecker.checkPackages(data.deps)
        })
        .then((data) => {
            data.name = packageName;
            data.userName = userName;
            // res.send(data)
            return data;
        })
        .then((data) => {
            return this.imageCreator.writeDataToImage(data)
        })
        .then(() => res.send({
            link: `http://${config.hostname}/badge/${userName}/${packageName}`
        }))
        .catch((err) => {
            res.send(err)
        });
    }
}

module.exports = MainController