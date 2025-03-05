import { DataTypes, Model,Sequelize } from 'sequelize';


class UserCourse extends Model {
    public id!: number;
    public user_id!: number;
    public course_id!: number;
    public end_date!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUcourseModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
UserCourse.init(
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
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        end_date: {
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
        modelName: 'user_course',
    }
);
isUserModelInitialized = true;
    }
}

export default UserCourse;
