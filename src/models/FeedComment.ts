import { DataTypes, Model, Sequelize } from 'sequelize';


class FeedComment extends Model {
    public id!: number;    
    public comment_desc!: string;
    public status!: string;
    public user_id!: number;
    public feed_id!: number;    
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeFeedCommentModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
FeedComment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },        
        comment_desc: {
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
        feed_id: {
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
        modelName: 'feed_comments',
    }
);
isUserModelInitialized = true;
    }
}
export default FeedComment;
