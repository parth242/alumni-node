import { DataTypes, Model, Sequelize } from "sequelize";

class JobApplication extends Model {
	public id!: number; // Primary key
	public institute_id!: number;
	public full_name!: string;
	public email_address!: string;
	public mobile_number!: string;
	public current_company!: string;
	public designation!: string;
	public total_years_of_experience!: number;
	public relevant_skills!: string; // Stored as a JSON string
	public resume!: string;
	public note!: string;	
	public apply_type!: string;
	public recruiter_name!: string;
	public recruiter_comment!: string;
	public status!: string;
	public job_id!: number;
	public user_id!: number;
	public readonly created_on!: Date; // Timestamps
	public readonly updated_on!: Date;
}

let isJobApplicationModelInitialized = false;

export function initializeJobApplicationModel(sequelize: Sequelize) {
	if (!isJobApplicationModelInitialized) {
		JobApplication.init(
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
				full_name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				email_address: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						isEmail: true,
					},
				},
				mobile_number: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				current_company: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				designation: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				note: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				apply_type: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				recruiter_name: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				recruiter_comment: {
					type: DataTypes.STRING,
					allowNull: true,
					defaultValue: "",
				},
				total_years_of_experience: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				relevant_skills: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				resume: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				status: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				job_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "jobs",
						key: "id",
					},
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "users",
						key: "id",
					},
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
				modelName: "job_applications",
			},
		);

		isJobApplicationModelInitialized = true;
	}
}

export default JobApplication;
