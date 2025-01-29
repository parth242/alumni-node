"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Assuming you have a database configuration
class AlumniMessage extends sequelize_1.Model {
}
AlumniMessage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    sequelize: db_1.sequelize,
    modelName: 'alumni_messages',
});
exports.default = AlumniMessage;
//# sourceMappingURL=Account.js.map