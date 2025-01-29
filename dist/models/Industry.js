"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeIndustryModel = void 0;
const sequelize_1 = require("sequelize");
class Industries extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeIndustryModel(sequelize) {
    if (!isUserModelInitialized) {
        Industries.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            industry_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
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
            modelName: "industries",
        });
        isUserModelInitialized = true;
    }
}
exports.initializeIndustryModel = initializeIndustryModel;
exports.default = Industries;
//# sourceMappingURL=Industry.js.map