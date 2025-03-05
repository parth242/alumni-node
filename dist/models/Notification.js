"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeNotificationModel = initializeNotificationModel;
const sequelize_1 = require("sequelize");
class Notification extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeNotificationModel(sequelize) {
    if (!isUserModelInitialized) {
        Notification.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            message_desc: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            notify_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            sender_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            receiver_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            is_read: {
                type: sequelize_1.DataTypes.INTEGER,
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
            modelName: 'notifications',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Notification;
//# sourceMappingURL=Notification.js.map