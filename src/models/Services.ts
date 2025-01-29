import { DataTypes, Model, Sequelize } from "sequelize";

class Services extends Model {
    public id!: number;
    public service_name!: string;
    public is_custom!: boolean;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isServicesModelInitialized = false;

export function initializeServicesModel(sequelize: Sequelize) {
    if (!isServicesModelInitialized) {
        Services.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                service_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                is_custom: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
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
                modelName: "services",
            }
        );
        isServicesModelInitialized = true;
    }
}

export default Services;
