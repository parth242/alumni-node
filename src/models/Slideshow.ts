import { DataTypes, Model, Sequelize } from 'sequelize';


class Slideshows extends Model {
    public id!: number;
    public institute_id!: number;
    public slide_title!: string; 
    public slide_image!: string; 
    public slide_description!: string;   
    public status!: string;
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeSlideshowModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Slideshows.init(
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
        slide_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        slide_image: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        slide_description: {
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: 'slideshows',
    }
);
isUserModelInitialized = true;
    }
}

export default Slideshows;
