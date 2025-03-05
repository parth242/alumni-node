import { DataTypes, Model, Sequelize } from 'sequelize';


class FeedReport extends Model {
    public id!: number;    
    public report_reason!: string;   
    public user_id!: number;
    public feed_id!: number;    
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeFeedReportModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
FeedReport.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },        
        report_reason: {
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
        modelName: 'feed_reports',
    }
);
isUserModelInitialized = true;
    }
}
export default FeedReport;
