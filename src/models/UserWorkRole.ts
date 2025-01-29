import { DataTypes, Model, Sequelize } from 'sequelize';


class UserWorkRole extends Model {
    public id!: number;
    public user_id!: number;
    public workrole_id!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUWorkModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
UserWorkRole.init(
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
        workrole_id: {
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
        modelName: 'user_workroles',
    }
);
isUserModelInitialized = true;
    }
}

export default UserWorkRole;
