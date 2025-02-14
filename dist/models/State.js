"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeStateModel = initializeStateModel;
const sequelize_1 = require("sequelize");
class States extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeStateModel(sequelize) {
    if (!isUserModelInitialized) {
        States.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            country_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            state_name: {
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
            sequelize,
            modelName: 'states',
        });
        isUserModelInitialized = true;
    }
}
exports.default = States;
//# sourceMappingURL=State.js.map