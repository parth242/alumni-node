"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCourseModel = initializeCourseModel;
const sequelize_1 = require("sequelize");
class Courses extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeCourseModel(sequelize) {
    if (!isUserModelInitialized) {
        Courses.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            course_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            course_shortcode: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            course_level: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "inactive",
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
            modelName: 'courses',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Courses;
//# sourceMappingURL=Course.js.map