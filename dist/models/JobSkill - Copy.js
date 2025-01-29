"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Assuming you have a database configuration
class JobSkill extends sequelize_1.Model {
}
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
    skill_id: {
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
    sequelize: db_1.sequelize,
    modelName: 'job_skills',
});
exports.default = JobSkill;
//# sourceMappingURL=JobSkill%20-%20Copy.js.map