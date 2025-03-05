import { DataTypes, Model, Sequelize } from 'sequelize';


class UserGroup extends Model {
    public id!: number;
    public user_id!: number;
    public group_id!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUGroupModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
UserGroup.init(
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
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,    
            defaultValue: 0,        
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
        modelName: 'user_group',
    }
);
isUserModelInitialized = true
    }
}

export default UserGroup;
