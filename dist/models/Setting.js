"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSettingModel = initializeSettingModel;
const sequelize_1 = require("sequelize");
class Settings extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeSettingModel(sequelize) {
    if (!isUserModelInitialized) {
        Settings.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            collage_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            collage_logo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            contact_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            contact_mobileno: {
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
            modelName: 'settings',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Settings;
//# sourceMappingURL=Setting.js.map