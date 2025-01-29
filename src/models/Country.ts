import { DataTypes, Model, Sequelize } from 'sequelize';

class Countrys extends Model {
    public id!: number;
    public country_name!: string;
    public country_short_code!: string;
    public country_phone_code!: string;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeCountryModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Countrys.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },        
        country_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country_short_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country_phone_code: {
            type: DataTypes.INTEGER,           
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
        modelName: 'countrys',
    }
);
isUserModelInitialized = true;
    }
}

export default Countrys;
