'use strict'

const Jimp = require('jimp')
const path = require('path')

class ImageCreatorService {
    writeDataToImage(dependencyData) {
        const templatePath = path.resolve(__dirname,
            '../../../../public/images/template.png');
        let loadedImage;

        return Jimp.read(templatePath)
            .then((image) => {
                loadedImage = image;
                return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            })
            .then((font) => {

                loadedImage.print(font, 10, 10, dependencyData.name)
                    .print(font, 76, 69, dependencyData.major.toString())
                    .print(font, 76, 111, dependencyData.minorOrPatch.toString())
                    .print(font, 76, 155, dependencyData.upToDate.toString())
                    .write(path.resolve(__dirname,
                        '../../../../public/images/badges/badge_' +
                        dependencyData.userName + '_' +
                        dependencyData.name + '.png'));
            })
            .catch((err) => console.error(err));
    }
}

module.exports = ImageCreatorService;