import { DataTypes, Model, Sequelize } from 'sequelize';


class Users extends Model {
    public id!: number;
    public institute_id!: number;
    public first_name!: string;
    public salutation!: string;
    public middle_name!: string;
    public last_name!: string;
    public nickname!: string;
    public gender!: string;
    public email!: string;
    public country_mobileno_code!: number;
    public mobileno!: string;
    public country_workno_code!: number;
    public work_phone_no!: string;
    public batch_start!: string;
    public batch_end!: string;
    public department_id!: number;
    public course_id!: number;
    public role_id!: number;
    public is_admin!: number;
    public is_alumni!: number;
    public status!: string;
    public password!: string;
    public address1!: string;
    public city!: string;
    public state_id!: number;
    public country_id!: number;
    public address2!: string;
    public city2!: string;
    public state2_id!: number;
    public country2_id!: number;
    public email_alternate!: string;
    public image!: string;
    public linkedin_url!: string;
    public facebook_url!: string;
    public twitter_url!: string;
    public instagram_url!: string;
    public youtube_url!: string;
    public about_me!: string;
    public professional_headline!: string;
    public company_name!: string;
    public position!: string;
    public relationship_status!: string;
    public company_start_period!: number;
    public company_end_period!: number;
    public total_experience!: number;
    public dob!: Date;
    public resetPasswordToken!: string;
    public resetPasswordExpires!: Date;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeUserModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Users.init(
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
        salutation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },        
        middle_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        country_mobileno_code: {
            type: DataTypes.INTEGER,
            allowNull: false,           
        },
        mobileno: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        country_workno_code: {
            type: DataTypes.INTEGER,
            allowNull: true,           
        },
        work_phone_no: {
            type: DataTypes.STRING,
            allowNull: true,           
        },
        email_alternate: {
            type: DataTypes.STRING,
            allowNull: true,           
        },
        batch_start: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        batch_end: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,  
            defaultValue: 0,         
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0,         
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending",
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_admin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_alumni: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        relationship_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address1: {
            type: DataTypes.STRING,
            allowNull: false,
        },       
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address2: {
            type: DataTypes.STRING,
            allowNull: true,
        },       
        city2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state2_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        country2_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedin_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        twitter_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        facebook_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        instagram_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        youtube_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        about_me: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        professional_headline: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_start_period: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        company_end_period: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        total_experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
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
        modelName: 'users',
    }
);

isUserModelInitialized = true;
    }
}

export default Users;
