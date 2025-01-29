"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJobAreaModel = void 0;
const sequelize_1 = require("sequelize");
class JobArea extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeJobAreaModel(sequelize) {
    if (!isUserModelInitialized) {
        JobArea.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            job_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            area_name: {
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
            modelName: 'job_areas',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeJobAreaModel = initializeJobAreaModel;
exports.default = JobArea;
//# sourceMappingURL=JobArea.js.map