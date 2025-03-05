"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEmailTemplateModel = initializeEmailTemplateModel;
const sequelize_1 = require("sequelize");
class EmailTemplates extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeEmailTemplateModel(sequelize) {
    if (!isUserModelInitialized) {
        EmailTemplates.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            alumni_register_mail_admin: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            alumni_register_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            alumni_confirm_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            alumni_reset_password_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            new_event_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            new_job_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            job_confirm_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            event_confirm_mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            update_job_status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            refer_job_friend: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            update_post_status: {
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
            modelName: 'email_templates',
        });
        isUserModelInitialized = true;
    }
}
exports.default = EmailTemplates;
//# sourceMappingURL=EmailTemplate.js.map