"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUEducationModel = void 0;
const sequelize_1 = require("sequelize");
class UserEducation extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUEducationModel(sequelize) {
    if (!isUserModelInitialized) {
        UserEducation.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            university: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            degree: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            course_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            department_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            specialization: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            start_year: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            end_year: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            is_additional: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
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
            modelName: 'user_education',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeUEducationModel = initializeUEducationModel;
exports.default = UserEducation;
//# sourceMappingURL=UserEducation.js.map