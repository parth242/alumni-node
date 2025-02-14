"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAreaModel = initializeAreaModel;
const sequelize_1 = require("sequelize");
class Professionalareas extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeAreaModel(sequelize) {
    if (!isUserModelInitialized) {
        Professionalareas.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            area_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "active",
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
            modelName: 'professionalareas',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Professionalareas;
//# sourceMappingURL=Professionalarea.js.map