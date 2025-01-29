"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSkillModel = void 0;
const sequelize_1 = require("sequelize");
class Professionalskills extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeSkillModel(sequelize) {
    if (!isUserModelInitialized) {
        Professionalskills.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            skill_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "active",
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
            modelName: 'professionalskills',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeSkillModel = initializeSkillModel;
exports.default = Professionalskills;
//# sourceMappingURL=Professionalskill.js.map