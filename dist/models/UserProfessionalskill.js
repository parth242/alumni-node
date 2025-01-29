"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUSkillModel = void 0;
const sequelize_1 = require("sequelize");
class UserProfessionalskill extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeUSkillModel(sequelize) {
    if (!isUserModelInitialized) {
        UserProfessionalskill.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
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
            sequelize,
            modelName: 'user_professionalskills',
        });
        isUserModelInitialized = true;
    }
}
exports.initializeUSkillModel = initializeUSkillModel;
exports.default = UserProfessionalskill;
//# sourceMappingURL=UserProfessionalskill.js.map