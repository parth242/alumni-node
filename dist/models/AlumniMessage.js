"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMessageModel = initializeMessageModel;
const sequelize_1 = require("sequelize");
class AlumniMessage extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeMessageModel(sequelize) {
    if (!isUserModelInitialized) {
        AlumniMessage.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            subject: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            message_desc: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            sender_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            receiver_id: {
                type: sequelize_1.DataTypes.INTEGER,
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
            modelName: 'alumni_messages',
        });
        isUserModelInitialized = true;
    }
}
exports.default = AlumniMessage;
//# sourceMappingURL=AlumniMessage.js.map