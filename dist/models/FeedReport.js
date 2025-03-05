"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFeedReportModel = initializeFeedReportModel;
const sequelize_1 = require("sequelize");
class FeedReport extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeFeedReportModel(sequelize) {
    if (!isUserModelInitialized) {
        FeedReport.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            report_reason: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            feed_id: {
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
            modelName: 'feed_reports',
        });
        isUserModelInitialized = true;
    }
}
exports.default = FeedReport;
//# sourceMappingURL=FeedReport.js.map