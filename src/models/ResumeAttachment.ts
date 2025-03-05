import { DataTypes, Model, Sequelize } from "sequelize";

class ResumeAttachments extends Model {
	public id!: number;
	// public institute_id!: number;
	public user_id!: number;
	public resume_title!: string;
	public attachment_type!: string;
	public attachment_file!: string;
	public show_on_profile!: string;
	public readonly created_on!: Date;
	public readonly updated_on!: Date;
}

let isUserModelInitialized = false;

export function initializeResumeModel(sequelize: Sequelize) {
	if (!isUserModelInitialized) {
		ResumeAttachments.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
				},
				// institute_id: {
				// 	type: DataTypes.INTEGER,
				// 	allowNull: false,
				// },
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				resume_title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				attachment_type: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				attachment_file: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				show_on_profile: {
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
				modelName: "resume_attachments",
			},
		);
		isUserModelInitialized = true;
	}
}

export default ResumeAttachments;
