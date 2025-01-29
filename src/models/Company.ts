import { DataTypes, Model, Sequelize } from 'sequelize';

class Companies extends Model {
    public id!: number;    
    public user_id!: number;
    public company_name!: string;
    public position!: string;
    public company_start_period!: number;
    public company_end_period!: number;
    public company_location!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeCompanyModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Companies.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        company_start_period: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_end_period: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_location: {
            type: DataTypes.STRING,
            allowNull: true,            
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
        modelName: 'user_companies',
    }
);
isUserModelInitialized = true;
    }
}

export default Companies;
