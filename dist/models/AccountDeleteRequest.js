"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDeleteModel = void 0;
const sequelize_1 = require("sequelize");
class AccountDeleteRequest extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeDeleteModel(sequelize) {
    if (!isUserModelInitialized) {
        AccountDeleteRequest.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            mobile_no: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            delete_message: {
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
            modelName: 'account_deleterequest',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeDeleteModel = initializeDeleteModel;
exports.default = AccountDeleteRequest;
//# sourceMappingURL=AccountDeleteRequest.js.map