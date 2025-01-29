import { DataTypes, Model, Sequelize } from 'sequelize';


class Submenus extends Model {
    public id!: number;
    public moduleshortname!: string;
    public module_alias!: string;
    public moduledescription!: string;
    public mainmodule_id!: number;
    public action!: string;
    public page_url!: number;
    public icon!: string;
    public menu!: number;
    public ordering!: number;
}

let isUserModelInitialized = false;

export function initializeSubmenuModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Submenus.init(
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
        icon: {
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
        modelName: 'submenus',
    }
);
isUserModelInitialized = true;
    }
}

export default Submenus;
