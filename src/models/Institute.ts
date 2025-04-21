import { DataTypes, Model, Sequelize } from "sequelize";

class Institutes extends Model {
    public id!: number;
    public institute_id!: number;  
    public institute_name!: string;
    public institute_siteurl!: string;
    public institute_logo!: string;
    public university_id!: number;  
    public status!: string;
    public twitter_url!: string;
    public facebook_url!: string;
    public instagram_url!: string;
    public linkedin_url!: string;
    public contact_number!: string;
    public contact_email!: string;
    public site_address!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isInstitutesModelInitialized = false;

export function initializeInstitutesModel(sequelize: Sequelize) {
    if (!isInstitutesModelInitialized) {
        Institutes.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                institute_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },  
                institute_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                institute_siteurl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                institute_logo: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                university_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },                
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                twitter_url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                facebook_url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                instagram_url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                linkedin_url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                contact_number: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                contact_email: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                site_address: {
                    type: DataTypes.STRING,
                    allowNull: true,
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
                modelName: "institutes",
            }
        );
        isInstitutesModelInitialized = true;
    }
}

export default Institutes;
