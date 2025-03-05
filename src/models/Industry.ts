import { DataTypes, Model, Sequelize } from "sequelize";

class Industries extends Model {
    public id!: number;
    public institute_id!: number;
    public industry_name!: string;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}
let isUserModelInitialized = false;

export function initializeIndustryModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
        Industries.init(
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
                industry_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "inactive",
                },
                createdAt: {
                    field: "created_on",
                    type: DataTypes.DATE,
                },
                updatedAt: {
                    field: "updated_on",
                    type: DataTypes.DATE,
                },
            },
            {
                timestamps: true,
                sequelize,
                modelName: "industries",
            }
        );
        isUserModelInitialized = true;
    }
}
export default Industries;
