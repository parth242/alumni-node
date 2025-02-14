"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUWorkModel = initializeUWorkModel;
const sequelize_1 = require("sequelize");
class UserWorkRole extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUWorkModel(sequelize) {
    if (!isUserModelInitialized) {
        UserWorkRole.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            workrole_id: {
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
            modelName: 'user_workroles',
        });
        isUserModelInitialized = true;
    }
}
exports.default = UserWorkRole;
//# sourceMappingURL=UserWorkRole.js.map