"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Assuming you have a database configuration
class Professionalskills extends sequelize_1.Model {
}
Professionalskills.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    skill_name: {
        type: sequelize_1.DataTypes.STRING,
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
    sequelize: db_1.sequelize,
    modelName: 'professionalskills',
});
exports.default = Professionalskills;
//# sourceMappingURL=Professionalskill%20-%20Copy.js.map