"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCategoryModel = initializeCategoryModel;
const sequelize_1 = require("sequelize");
class Categorys extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeCategoryModel(sequelize) {
    if (!isUserModelInitialized) {
        Categorys.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            category_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
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
            modelName: 'dashboard_category',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Categorys;
//# sourceMappingURL=Category.js.map