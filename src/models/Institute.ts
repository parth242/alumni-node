import { DataTypes, Model, Sequelize } from "sequelize";

class Institutes extends Model {
    public id!: number;
    public institute_id!: number;  
    public institute_name!: string;
    public institute_siteurl!: string;
    public university_id!: number;  
    public status!: string;
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
                university_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },                
                status: {
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
                modelName: "institutes",
            }
        );
        isInstitutesModelInitialized = true;
    }
}

export default Institutes;
