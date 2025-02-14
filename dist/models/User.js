"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserModel = initializeUserModel;
const sequelize_1 = require("sequelize");
class Users extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUserModel(sequelize) {
    if (!isUserModelInitialized) {
        Users.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            salutation: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            middle_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            nickname: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            country_mobileno_code: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            mobileno: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            country_workno_code: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            work_phone_no: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            email_alternate: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            batch_start: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            batch_end: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                unique: false,
            },
            department_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            course_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "pending",
            },
            role_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            is_admin: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_alumni: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            gender: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            dob: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            relationship_status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            address1: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            state_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            country_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            address2: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            city2: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            state2_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            country2_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            linkedin_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            twitter_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            facebook_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            instagram_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            youtube_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            about_me: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            professional_headline: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            company_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            position: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            company_start_period: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            company_end_period: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_experience: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            resetPasswordToken: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            resetPasswordExpires: {
                type: sequelize_1.DataTypes.DATE,
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
            modelName: 'users',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Users;
//# sourceMappingURL=User.js.map