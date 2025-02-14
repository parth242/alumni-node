"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJobApplicationModel = initializeJobApplicationModel;
const sequelize_1 = require("sequelize");
class JobApplication extends sequelize_1.Model {
}
let isJobApplicationModelInitialized = false;
function initializeJobApplicationModel(sequelize) {
    if (!isJobApplicationModelInitialized) {
        JobApplication.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            full_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            email_address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            mobile_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            current_company: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            designation: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            note: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            apply_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            recruiter_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            recruiter_comment: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            total_years_of_experience: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            relevant_skills: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            resume: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            job_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "jobs",
                    key: "id",
                },
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
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
            modelName: "job_applications",
        });
        isJobApplicationModelInitialized = true;
    }
}
exports.default = JobApplication;
//# sourceMappingURL=JobApplication.js.map