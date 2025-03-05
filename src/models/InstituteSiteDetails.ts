import { DataTypes, Model, Sequelize } from "sequelize";

class InstituteSiteDetails extends Model {
    public id!: number;
    public institute_name!: string;
    public institute_siteurl!: string;
    public group_id!: number;
    public site_dbhost!: string;
    public site_dbuser!: string;
    public site_dbpassword!: string;
    public site_dbname!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isInstituteSiteDetailsModelInitialized = false;

export function initializeInstituteSiteDetailsModel(sequelize: Sequelize) {
    if (!isInstituteSiteDetailsModelInitialized) {
        InstituteSiteDetails.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                institute_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                institute_siteurl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                group_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                site_dbhost: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                site_dbuser: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                site_dbpassword: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                site_dbname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                createdAt: {
                    field: "created_on",
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    field: "updated_on",
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                timestamps: true,
                sequelize,
                modelName: "institute_sitedetails",
            }
        );
        isInstituteSiteDetailsModelInitialized = true;
    }
}

export default InstituteSiteDetails;
