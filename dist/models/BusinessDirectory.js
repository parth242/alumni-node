"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBusinessDirectoryModel = initializeBusinessDirectoryModel;
const sequelize_1 = require("sequelize");
const Industry_1 = __importDefault(require("./Industry"));
class BusinessDirectorys extends sequelize_1.Model {
}
let isUserModelInitialized = false;
function initializeBusinessDirectoryModel(sequelize) {
    if (!isUserModelInitialized) {
        BusinessDirectorys.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            business_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            business_website: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            contact_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            business_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            number_of_employees: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            founded: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1900,
                    max: new Date().getFullYear(),
                },
            },
            industry_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_member_association: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            business_logo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            member_ids: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            createdAt: {
                field: "created_on",
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                field: "updated_on",
                type: sequelize_1.DataTypes.DATE,
            },
            social_facebook: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true, // This allows the field to be null
                defaultValue: "", // Set default value as an empty string
            },
            social_instagram: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            social_linkedin: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            social_twitter: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            social_youtube: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            services: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            products: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
        }, {
            timestamps: true,
            sequelize,
            modelName: "business_directorys",
        });
        BusinessDirectorys.belongsTo(Industry_1.default, {
            foreignKey: "industry_id",
            targetKey: "id",
        });
        isUserModelInitialized = true;
    }
}
exports.default = BusinessDirectorys;
//# sourceMappingURL=BusinessDirectory.js.map