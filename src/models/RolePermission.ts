import { DataTypes, Model, Sequelize} from 'sequelize';


class RolePermission extends Model {
    public id!: number;
    public role_id!: number;
    public module_id!: number;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeRPermissionModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
RolePermission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        module_id: {
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
        modelName: 'role_permission',
    }
);
isUserModelInitialized = true;
    }
}

export default RolePermission;
