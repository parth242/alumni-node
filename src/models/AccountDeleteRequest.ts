import { DataTypes, Model, Sequelize } from 'sequelize';


class AccountDeleteRequest extends Model {
    public id!: number;
    public institute_id!: number;
    public user_id!: number;
    public mobile_no!: string;
    public delete_message!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeDeleteModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
AccountDeleteRequest.init(
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        mobile_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        delete_message: {
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
        modelName: 'account_deleterequest',
    }
);
isUserModelInitialized = true;
    }
}

export default AccountDeleteRequest;
