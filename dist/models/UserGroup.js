"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUGroupModel = void 0;
const sequelize_1 = require("sequelize");
class UserGroup extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUGroupModel(sequelize) {
    if (!isUserModelInitialized) {
        UserGroup.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            group_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
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
            modelName: 'user_group',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeUGroupModel = initializeUGroupModel;
exports.default = UserGroup;
//# sourceMappingURL=UserGroup.js.map