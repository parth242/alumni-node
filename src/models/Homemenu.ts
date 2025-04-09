import { DataTypes, Model, Sequelize } from 'sequelize';


class Homemenus extends Model {
    public id!: number;
    public moduleshortname!: string;
    public module_alias!: string;
    public moduledescription!: string;
    public mainmodule_id!: number;
    public action!: string;
    public page_url!: number;   
    public menu!: number;
    public ordering!: number; 
    public is_footermenu!: number; 
    public is_headermenu!: number;    
}

let isUserModelInitialized = false;

export function initializeHomemenuModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Homemenus.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        moduleshortname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        module_alias: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "inactive",
        },
        moduledescription: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        mainmodule_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        page_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },        
        menu: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        ordering: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        }, 
        is_headermenu: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }, 
        is_footermenu: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        modelName: 'homemenus',
    }
);
isUserModelInitialized = true;
    }
}

export default Homemenus;
