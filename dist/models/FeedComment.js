"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFeedCommentModel = initializeFeedCommentModel;
const sequelize_1 = require("sequelize");
class FeedComment extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeFeedCommentModel(sequelize) {
    if (!isUserModelInitialized) {
        FeedComment.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            comment_desc: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
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
            modelName: 'feed_comments',
        });
        isUserModelInitialized = true;
    }
}
exports.default = FeedComment;
//# sourceMappingURL=FeedComment.js.map