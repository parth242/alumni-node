"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUcourseModel = void 0;
const sequelize_1 = require("sequelize");
class UserCourse extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUcourseModel(sequelize) {
    if (!isUserModelInitialized) {
        UserCourse.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            course_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            end_date: {
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
            modelName: 'user_course',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeUcourseModel = initializeUcourseModel;
exports.default = UserCourse;
//# sourceMappingURL=UserCourse.js.map