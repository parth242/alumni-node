import { DataTypes, Model, Sequelize } from "sequelize";


class BusinessDirectorys extends Model {
	public id!: number;
	public institute_id!: number;
	public business_name!: string;
	public business_website!: string;
	public contact_number!: string;
	public business_email!: string;
	public industry_id!: number;
	public number_of_employees!: number;
	public founded!: number;
	public location!: string;
	public description!: string;
	public is_member_association!: number;
	public business_logo!: string;
	public user_id!: number;
	public status!: string;
	public social_facebook!: string;
	public social_instagram!: string;
	public social_linkedin!: string;
	public social_twitter!: string;
	public social_youtube!: string;
	public member_ids!: string;
	public services!: string;
	public products!: string;
	public readonly created_on!: Date;
	public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeBusinessDirectoryModel(sequelize: Sequelize) {
	if (!isUserModelInitialized) {
		BusinessDirectorys.init(
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
				business_name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				business_website: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				contact_number: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				business_email: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				number_of_employees: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: {
						min: 1,
					},
				},
				founded: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: {
						min: 1900,
						max: new Date().getFullYear(),
					},
				},
				industry_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				location: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				description: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				is_member_association: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				business_logo: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				status: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				member_ids: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				createdAt: {
					field: "created_on",
					type: DataTypes.DATE,
				},
				updatedAt: {
					field: "updated_on",
					type: DataTypes.DATE,
				},
				social_facebook: {
					type: DataTypes.STRING,
					allowNull: true, // This allows the field to be null
					defaultValue: "", // Set default value as an empty string
				},
				social_instagram: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				social_linkedin: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				social_twitter: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				social_youtube: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				services: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				products: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
			},
			{
				timestamps: true,
				sequelize,
				modelName: "business_directorys",
			},
		);
		
		isUserModelInitialized = true;
	}
}

export default BusinessDirectorys;
