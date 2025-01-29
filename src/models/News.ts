import { DataTypes, Model, Sequelize } from 'sequelize';


class News extends Model {
    public id!: number;
    public institute_id!: number;
    public title!: string;
    public posted_date!: string;
    public description!: string;
    public news_url!: string;    
    public status!: string;
    public user_id!: number;
    public group_id!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeNewsModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
News.init(
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
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        posted_date: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        news_url: {
            type: DataTypes.STRING,
            allowNull: false,            
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
        modelName: 'news',
    }
);
isUserModelInitialized = true;
    }
}

export default News;
