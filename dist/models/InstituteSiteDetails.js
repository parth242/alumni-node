"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeInstituteSiteDetailsModel = void 0;
const sequelize_1 = require("sequelize");
class InstituteSiteDetails extends sequelize_1.Model {
}
let isInstituteSiteDetailsModelInitialized = false;
function initializeInstituteSiteDetailsModel(sequelize) {
    if (!isInstituteSiteDetailsModelInitialized) {
        InstituteSiteDetails.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            institute_siteurl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            group_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            site_dbhost: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            site_dbuser: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            site_dbpassword: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            site_dbname: {
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
            modelName: "institute_sitedetails",
        });
        isInstituteSiteDetailsModelInitialized = true;
    }
}
exports.initializeInstituteSiteDetailsModel = initializeInstituteSiteDetailsModel;
exports.default = InstituteSiteDetails;
//# sourceMappingURL=InstituteSiteDetails.js.map