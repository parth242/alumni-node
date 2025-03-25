import { DataTypes, Model, Sequelize } from 'sequelize';


class Testimonials extends Model {
    public id!: number;
    public institute_id!: number;
    public story_description!: string;   
    public user_id!: number;
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeTestimonialModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {

Testimonials.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        story_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
       
        institute_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
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
        modelName: 'testimonials',
    }
);
isUserModelInitialized = true;
    }
}

export default Testimonials;
