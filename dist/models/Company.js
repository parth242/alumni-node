"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCompanyModel = initializeCompanyModel;
const sequelize_1 = require("sequelize");
class Companies extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeCompanyModel(sequelize) {
    if (!isUserModelInitialized) {
        Companies.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            company_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            position: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            company_start_period: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            company_end_period: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            company_location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
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
            modelName: 'user_companies',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Companies;
//# sourceMappingURL=Company.js.map