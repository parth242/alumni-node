"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSlideshowModel = initializeSlideshowModel;
const sequelize_1 = require("sequelize");
class Slideshows extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeSlideshowModel(sequelize) {
    if (!isUserModelInitialized) {
        Slideshows.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            slide_title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            slide_image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                field: "created_on",
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                field: "updated_on",
                type: sequelize_1.DataTypes.DATE,
            },
        }, {
            timestamps: true,
            sequelize,
            modelName: 'slideshows',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Slideshows;
//# sourceMappingURL=Slideshow.js.map