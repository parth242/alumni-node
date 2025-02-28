import { DataTypes, Model, Sequelize } from 'sequelize';


class JobArea extends Model {
    public id!: number;
    public job_id!: number;
    public area_name!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeJobAreaModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
JobArea.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        area_name: {
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
        modelName: 'job_areas',
    }
);
isUserModelInitialized = true;
    }
}

export default JobArea;
