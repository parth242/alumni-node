import { DataTypes, Model, Sequelize } from 'sequelize';


class WorkRoles extends Model {
    public id!: number;
    public institute_id!: number;
    public workrole_name!: string;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeWorkModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
WorkRoles.init(
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
        workrole_name: {
            type: DataTypes.STRING,
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
        modelName: 'work_role',
    }
);
isUserModelInitialized = true;
    }
}

export default WorkRoles;
