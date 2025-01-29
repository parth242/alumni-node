"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGroupModel = void 0;
const sequelize_1 = require("sequelize");
class Groups extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeGroupModel(sequelize) {
    if (!isUserModelInitialized) {
        Groups.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            group_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            institute_id: {
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
            sequelize,
            modelName: 'groups',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeGroupModel = initializeGroupModel;
exports.default = Groups;
//# sourceMappingURL=Group.js.map