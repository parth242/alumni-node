"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRPermissionModel = initializeRPermissionModel;
const sequelize_1 = require("sequelize");
class RolePermission extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeRPermissionModel(sequelize) {
    if (!isUserModelInitialized) {
        RolePermission.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            role_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            module_id: {
                type: sequelize_1.DataTypes.INTEGER,
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
            modelName: 'role_permission',
        });
        isUserModelInitialized = true;
    }
}
exports.default = RolePermission;
//# sourceMappingURL=RolePermission.js.map