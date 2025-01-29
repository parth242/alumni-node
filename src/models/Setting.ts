import { DataTypes, Model, Sequelize } from 'sequelize';


class Settings extends Model {
    public id!: number;
    public institute_id!: number;
    public collage_name!: string;
    public collage_logo!: number;
    public contact_name!: string;
    public contact_mobileno!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeSettingModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Settings.init(
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
        collage_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        collage_logo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact_name: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        contact_mobileno: {
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
        modelName: 'settings',
    }
);
isUserModelInitialized = true;
    }
}

export default Settings;
