"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEventModel = void 0;
const sequelize_1 = require("sequelize");
class Events extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeEventModel(sequelize) {
    if (!isUserModelInitialized) {
        Events.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            event_title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            event_date: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            event_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            event_category: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            event_image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            group_id: {
                type: sequelize_1.DataTypes.STRING,
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
            modelName: 'events',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeEventModel = initializeEventModel;
exports.default = Events;
//# sourceMappingURL=Event.js.map