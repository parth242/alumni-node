"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGalleryModel = initializeGalleryModel;
const sequelize_1 = require("sequelize");
class Gallery extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeGalleryModel(sequelize) {
    if (!isUserModelInitialized) {
        Gallery.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            gallery_image: {
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
            modelName: 'gallery',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Gallery;
//# sourceMappingURL=Gallery.js.map