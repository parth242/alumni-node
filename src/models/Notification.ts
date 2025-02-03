import { DataTypes, Model, Sequelize } from 'sequelize';


class Notification extends Model {
    public id!: number;    
    public message_desc!: string;
    public notify_url!: string;    
    public sender_id!: number;
    public receiver_id!: number;
    public is_read!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeNotificationModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },        
        message_desc: {
            type: DataTypes.STRING,
            allowNull: false,            
        },   
        notify_url: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_read: {
            type: DataTypes.INTEGER,
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
        modelName: 'notifications',
    }
);
isUserModelInitialized = true;
    }
}
export default Notification;
