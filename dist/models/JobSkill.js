"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJobSkillModel = void 0;
const sequelize_1 = require("sequelize");
class JobSkill extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeJobSkillModel(sequelize) {
    if (!isUserModelInitialized) {
        JobSkill.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            job_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            skill_name: {
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
            modelName: 'job_skills',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeJobSkillModel = initializeJobSkillModel;
exports.default = JobSkill;
//# sourceMappingURL=JobSkill.js.map