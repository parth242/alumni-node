"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFeedModel = initializeFeedModel;
const sequelize_1 = require("sequelize");
class Feed extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeFeedModel(sequelize) {
    if (!isUserModelInitialized) {
        Feed.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            feed_image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            group_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            category_id: {
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
            modelName: 'feeds',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Feed;
//# sourceMappingURL=Feed.js.map