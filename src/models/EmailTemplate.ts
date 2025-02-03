import { DataTypes, Model, Sequelize } from 'sequelize';


class EmailTemplates extends Model {
    public id!: number;
    public institute_id!: number;
    public alumni_register_mail_admin!: string;
    public alumni_register_mail!: string;
    public alumni_confirm_mail!: string;
    public alumni_reset_password_mail!: string;
    public new_event_mail!: string;
    public new_job_mail!: string;
    public update_job_status!: string;
    public refer_job_friend!: string;
    public update_post_status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeEmailTemplateModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
EmailTemplates.init(
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
        alumni_register_mail_admin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alumni_register_mail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alumni_confirm_mail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alumni_reset_password_mail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        new_event_mail: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        new_job_mail: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        update_job_status: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        refer_job_friend: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        update_post_status: {
            type: DataTypes.STRING,
            allowNull: true,            
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
        modelName: 'email_templates',
    }
);
isUserModelInitialized = true;
    }
}

export default EmailTemplates;
