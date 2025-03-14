import { DataTypes, Model, Sequelize } from 'sequelize';


class UserProfessionalskill extends Model {
    public id!: number;
    public user_id!: number;
    public skill_id!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUSkillModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
UserProfessionalskill.init(
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
        skill_id: {
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
        modelName: 'user_professionalskills',
    }
);
isUserModelInitialized = true;
    }
}

export default UserProfessionalskill;
