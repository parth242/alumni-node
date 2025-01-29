import { DataTypes, Model, Sequelize } from 'sequelize';


class States extends Model {
    public id!: number;
    public country_id!: number;
    public state_name!: string;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeStateModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
States.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        country_id: {
            type: DataTypes.INTEGER,            
        },
        state_name: {
            type: DataTypes.STRING,
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
        modelName: 'states',
    }
);
isUserModelInitialized = true;
    }
}

export default States;
