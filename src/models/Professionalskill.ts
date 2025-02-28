import { DataTypes, Model, Sequelize } from 'sequelize';


class Professionalskills extends Model {
    public id!: number;
    public institute_id!: number;
    public skill_name!: string;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeSkillModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Professionalskills.init(
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
        skill_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "active",
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
        modelName: 'professionalskills',
    }
);
isUserModelInitialized = true;
    }
}

export default Professionalskills;
