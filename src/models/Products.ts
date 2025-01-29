import { DataTypes, Model, Sequelize } from "sequelize";

class Products extends Model {
    public id!: number;
    public product_name!: string;
    public is_custom!: boolean;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isProductsModelInitialized = false;

export function initializeProductsModel(sequelize: Sequelize) {
    if (!isProductsModelInitialized) {
        Products.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                product_name: {
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
                modelName: "products",
            }
        );
        isProductsModelInitialized = true;
    }
}

export default Products;
