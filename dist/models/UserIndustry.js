"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUIndustryModel = void 0;
const sequelize_1 = require("sequelize");
class UserIndustry extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUIndustryModel(sequelize) {
    if (!isUserModelInitialized) {
        UserIndustry.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            industry_id: {
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
            modelName: 'user_industries',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeUIndustryModel = initializeUIndustryModel;
exports.default = UserIndustry;
//# sourceMappingURL=UserIndustry.js.map