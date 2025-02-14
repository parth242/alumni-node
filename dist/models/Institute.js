"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeInstitutesModel = initializeInstitutesModel;
const sequelize_1 = require("sequelize");
class Institutes extends sequelize_1.Model {
}
let isInstitutesModelInitialized = false;
function initializeInstitutesModel(sequelize) {
    if (!isInstitutesModelInitialized) {
        Institutes.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            institute_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            institute_siteurl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            university_id: {
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
                allowNull: false,
            },
            updatedAt: {
                field: "updated_on",
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        }, {
            timestamps: true,
            sequelize,
            modelName: "institutes",
        });
        isInstitutesModelInitialized = true;
    }
}
exports.default = Institutes;
//# sourceMappingURL=Institute.js.map