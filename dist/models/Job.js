"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJobModel = void 0;
const sequelize_1 = require("sequelize");
class Jobs extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeJobModel(sequelize) {
    if (!isUserModelInitialized) {
        Jobs.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            job_title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            company: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            contact_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            job_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            deadline_date: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            posted_date: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            job_description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            company_website: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            experience_from: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            experience_to: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            salary_package: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
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
            modelName: 'jobs',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeJobModel = initializeJobModel;
exports.default = Jobs;
//# sourceMappingURL=Job.js.map