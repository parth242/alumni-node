"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeResumeModel = initializeResumeModel;
const sequelize_1 = require("sequelize");
class ResumeAttachments extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeResumeModel(sequelize) {
    if (!isUserModelInitialized) {
        ResumeAttachments.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            // institute_id: {
            // 	type: DataTypes.INTEGER,
            // 	allowNull: false,
            // },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            resume_title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            attachment_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            attachment_file: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            show_on_profile: {
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
            modelName: "resume_attachments",
        });
        isUserModelInitialized = true;
    }
}
exports.default = ResumeAttachments;
//# sourceMappingURL=ResumeAttachment.js.map