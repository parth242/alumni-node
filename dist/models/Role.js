"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRoleModel = initializeRoleModel;
const sequelize_1 = require("sequelize");
class Roles extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeRoleModel(sequelize) {
    if (!isUserModelInitialized) {
        Roles.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
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
            modelName: 'roles',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Roles;
//# sourceMappingURL=Role.js.map