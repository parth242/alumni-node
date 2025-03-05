import { DataTypes, Model, Sequelize } from 'sequelize';


class UserEducation extends Model {
    public id!: number;
    public user_id!: number;
    public university!: string;
    public degree!: string;
    public course_id!: number;
    public department_id!: number;
    public specialization!: string;
    public start_year!: number;
    public end_year!: number;
    public location!: string;
    public is_additional!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUEducationModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
UserEducation.init(
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
        university: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        degree: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,  
            defaultValue: 0,          
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,      
            defaultValue: 0,       
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        start_year: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        end_year: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        is_additional: {
            type: DataTypes.INTEGER,
            allowNull: false,    
            defaultValue: 0,        
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
        modelName: 'user_education',
    }
);
isUserModelInitialized = true;
    }
}

export default UserEducation;
