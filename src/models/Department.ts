import { DataTypes, Model, Sequelize } from 'sequelize';


class Departments extends Model {
    public id!: number;
    public institute_id!: number;
    public department_name!: string;
    public department_shortcode!: string;
    public course_id!: number;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeDepartmentModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {

Departments.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        department_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department_shortcode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        institute_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        course_id: {
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
        modelName: 'departments',
    }
);
isUserModelInitialized = true;
    }
}

export default Departments;
