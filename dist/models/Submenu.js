"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSubmenuModel = initializeSubmenuModel;
const sequelize_1 = require("sequelize");
class Submenus extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeSubmenuModel(sequelize) {
    if (!isUserModelInitialized) {
        Submenus.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            moduleshortname: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            module_alias: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "inactive",
            },
            moduledescription: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            mainmodule_id: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
            action: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            page_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            icon: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            menu: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
            ordering: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 1,
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
            modelName: 'submenus',
        });
        isUserModelInitialized = true;
    }
}
exports.default = Submenus;
//# sourceMappingURL=Submenu.js.map