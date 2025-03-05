import { DataTypes, Model, Sequelize } from 'sequelize';


class Feed extends Model {
    public id!: number;
    public institute_id!: number;
    public description!: string;
    public feed_image!: string;
    public status!: string;
    public user_id!: number;
    public group_id!: number;
    public category_id!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeFeedModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Feed.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,            
        },   
        feed_image: {
            type: DataTypes.STRING,
            allowNull: true,            
        },      
        status: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        category_id: {
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
        modelName: 'feeds',
    }
);
isUserModelInitialized = true;
    }
}
export default Feed;
