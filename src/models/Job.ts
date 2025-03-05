import { DataTypes, Model, Sequelize} from 'sequelize';


class Jobs extends Model {
    public id!: number;
    public institute_id!: number;
    public is_internship!: number;
    public job_title!: string;
    public company!: string;
    public location!: string;
    public contact_email!: string;
    public job_type!: string;    
    public deadline_date!: string;
    public company_website!: string;
    public experience_from!: number;
    public experience_to!: number;
    public duration!: string;
    public salary_package!: string;
    public job_description!: string;
    public user_id!: number;
    public status!: string;
    public posted_date!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeJobModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Jobs.init(
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
        is_internship: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        contact_email: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        job_type: {
            type: DataTypes.STRING,
            allowNull: false,            
        },      
        
        deadline_date: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        posted_date: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        job_description: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        company_website: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        experience_from: {
            type: DataTypes.INTEGER,            
        },
        experience_to: {
            type: DataTypes.INTEGER,            
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        salary_package: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
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
        modelName: 'jobs',
    }
);
isUserModelInitialized = true;
    }
}

export default Jobs;
