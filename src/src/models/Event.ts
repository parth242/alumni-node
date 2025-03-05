import { DataTypes, Model, Sequelize } from 'sequelize';


class Events extends Model {
    public id!: number;
    public institute_id!: number;
    public event_title!: string;
    public event_time!: string;
    public event_date!: string;
    public event_type!: string;
    public event_category!: string;    
    public location!: string;
    public description!: string;
    public event_image!: string;
    public group_id!: string;
    public join_members!: number[];
    public maybe_members!: number[];
    public decline_members!: number[];
    public user_id!: number;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeEventModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {

Events.init(
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
        event_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        event_time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        event_date: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        event_type: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        event_category: {
            type: DataTypes.STRING,
            allowNull: false,            
        },        
        location: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        event_image: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        group_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        join_members: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        maybe_members: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        decline_members: {
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
        modelName: 'events',
    }
);
isUserModelInitialized = true;
    }
}
export default Events;
