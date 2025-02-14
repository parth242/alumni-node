"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWorkModel = initializeWorkModel;
const sequelize_1 = require("sequelize");
class WorkRoles extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeWorkModel(sequelize) {
    if (!isUserModelInitialized) {
        WorkRoles.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            workrole_name: {
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
            modelName: 'work_role',
        });
        isUserModelInitialized = true;
    }
}
exports.default = WorkRoles;
//# sourceMappingURL=WorkRole.js.map