"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCountryModel = initializeCountryModel;
const sequelize_1 = require("sequelize");
class Countrys extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeCountryModel(sequelize) {
    if (!isUserModelInitialized) {
        Countrys.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            country_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            country_short_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            country_phone_code: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "inactive",
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
            modelName: 'countrys',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Countrys;
//# sourceMappingURL=Country.js.map