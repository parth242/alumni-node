import { DataTypes, Model, Sequelize } from 'sequelize';


class Gallery extends Model {
    public id!: number;
    public institute_id!: number;
    public gallery_image!: string;    
    public readonly created_on!: Date;
    public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeGalleryModel(sequelize: Sequelize) {
    if (!isUserModelInitialized) {
Gallery.init(
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
        gallery_image: {
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
        modelName: 'gallery',
    }
);
isUserModelInitialized = true;
    }
}

export default Gallery;
