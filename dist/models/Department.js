"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDepartmentModel = initializeDepartmentModel;
const sequelize_1 = require("sequelize");
class Departments extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeDepartmentModel(sequelize) {
    if (!isUserModelInitialized) {
        Departments.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            department_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            department_shortcode: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            course_id: {
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
            modelName: 'departments',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Departments;
//# sourceMappingURL=Department.js.map