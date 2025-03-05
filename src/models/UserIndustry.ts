import { DataTypes, Model, Sequelize } from 'sequelize';


class UserIndustry extends Model {
    public id!: number;
    public user_id!: number;
    public industry_id!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUIndustryModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
UserIndustry.init(
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
        industry_id: {
            type: DataTypes.INTEGER,
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
        modelName: 'user_industries',
    }
);
isUserModelInitialized = true;
    }
}

export default UserIndustry;
