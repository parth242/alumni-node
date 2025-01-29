"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeServicesModel = void 0;
const sequelize_1 = require("sequelize");
class Services extends sequelize_1.Model {
}
let isServicesModelInitialized = false;
function initializeServicesModel(sequelize) {
    if (!isServicesModelInitialized) {
        Services.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            service_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_custom: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
            modelName: "services",
        });
        isServicesModelInitialized = true;
    }
}
exports.initializeServicesModel = initializeServicesModel;
exports.default = Services;
//# sourceMappingURL=Services.js.map