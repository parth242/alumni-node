import { DataTypes, Model, Sequelize } from 'sequelize';


class Courses extends Model {
    public id!: number;
    public course_level!: number;
    public course_name!: string;
    public course_shortcode!: string;
    public institute_id!: number;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}
let isUserModelInitialized = false;

export function initializeCourseModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Courses.init(
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
        course_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_shortcode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "inactive",
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
        modelName: 'courses',
    }
);
isUserModelInitialized = true;
    }
}

export default Courses;
