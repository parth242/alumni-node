import { DataTypes, Model, Sequelize } from 'sequelize';

class AlumniMessage extends Model {
    public id!: number;
    public institute_id!: number;
    public subject!: string;
    public message_desc!: string;
    public sender_id!: number;
    public receiver_id!: number;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeMessageModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
AlumniMessage.init(
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
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message_desc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "active",
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
        modelName: 'alumni_messages',
    }
);
isUserModelInitialized = true;
    }
}

export default AlumniMessage;
