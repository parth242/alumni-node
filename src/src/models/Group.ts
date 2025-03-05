import { DataTypes, Model, Sequelize } from 'sequelize';


class Groups extends Model {
    public id!: number;
    public institute_id!: number;
    public group_name!: string;    
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeGroupModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {

Groups.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        group_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        institute_id: {
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
        modelName: 'groups',
    }
);
isUserModelInitialized = true;
    }
}

export default Groups;
