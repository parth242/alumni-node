import { DataTypes, Model, Sequelize } from 'sequelize';


class Categorys extends Model {
    public id!: number;
    public institute_id!: number;
    public category_name!: string;  
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeCategoryModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {

Categorys.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        institute_id: {
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
          },
          updatedAt: {
            field: "updated_on",
            type: DataTypes.DATE,
          },
        
    },
    {
        timestamps: true,
        sequelize,
        modelName: 'dashboard_category',
    }
);
isUserModelInitialized = true;
    }
}

export default Categorys;
