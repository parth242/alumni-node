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
            institute_logo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            university_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            twitter_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            facebook_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            instagram_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            linkedin_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            contact_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            contact_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            site_address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
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