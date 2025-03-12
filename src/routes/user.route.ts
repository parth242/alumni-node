import express, { json } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Users, { initializeUserModel } from "../models/User";
import { getSequelize } from "../config/db";
import Departments, { initializeDepartmentModel } from "../models/Department";
import AlumniMessage from "../models/AlumniMessage";
import Roles, { initializeRoleModel } from "../models/Role";
import { catchError } from "../common/functions";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { auth } from "../middleware/auth";
import UserGroup, { initializeUGroupModel } from "../models/UserGroup";
import multer from "multer";
import fs from "fs";
import AccountDeleteRequest from "../models/AccountDeleteRequest";
import Countrys, { initializeCountryModel } from "../models/Country";
import States, { initializeStateModel } from "../models/State";
import UserEducation, {
	initializeUEducationModel,
} from "../models/UserEducation";
import Courses, { initializeCourseModel } from "../models/Course";
import Events, { initializeEventModel } from '../models/Event';
import EmailTemplates , { initializeEmailTemplateModel } from '../models/EmailTemplate';
import Institutes , { initializeInstitutesModel } from '../models/Institute';
import Groups, { initializeGroupModel } from '../models/Group';
import { Op, WhereOptions, WhereAttributeHash, Sequelize  } from "sequelize";
import nodemailer from "nodemailer";

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const directory = req.body.type || "";

		const dir = "dist/uploads/" + directory;
		if (fs.existsSync(dir)) {
			cb(null, dir);
		} else {
			fs.mkdirSync(dir);
			cb(null, dir);
		}
	},
	filename: function (req, file, cb) {
		const file_ext = file.originalname.split(".").pop();
		// var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
		// var file_name = crypto.createHash('md5').update(random_string).digest('hex');
		// var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
		const file_name =
			Date.now() +
			"_" +
			file.originalname
				.replace("." + file_ext, "")
				.replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, "_");
		cb(null, file_name + "." + file_ext); //Appending extension
	},
});
const upload = multer({
	storage: storage,
});

const userRouter = express.Router();

userRouter.get("/isalumni=:isalumninew/", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	initializeRoleModel(getSequelize());
	initializeUEducationModel(getSequelize());
	initializeCourseModel(getSequelize());
	initializeDepartmentModel(getSequelize());
	console.log("req.query.filter_status", req.query.filter_status);
	const instituteId = (req as any).instituteId;

	Roles.hasMany(Users, { foreignKey: "role_id" });
	Users.belongsTo(Roles, { foreignKey: "role_id", targetKey: "id" });

	Users.hasMany(UserEducation, { foreignKey: "user_id" });
	UserEducation.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });

	Courses.hasMany(UserEducation, { foreignKey: "course_id" });
	UserEducation.belongsTo(Courses, {
		foreignKey: "course_id",
		targetKey: "id",
	});

	Departments.hasMany(UserEducation, { foreignKey: "department_id" });
	UserEducation.belongsTo(Departments, {
		foreignKey: "department_id",
		targetKey: "id",
	});

	interface FilterWhere {
		is_alumni: string;
		institute_id: string;
		[key: string]: string | undefined; // Allow additional properties
	}

	interface CourseWhere {
		is_additional: Number;
		[key: string]: Number; // Allow additional properties
	}

	let filterwhere: FilterWhere = {
		is_alumni: req.params.isalumninew,
		institute_id: instituteId,
	};
	let coursewhere: CourseWhere = { is_additional: 0 };
	let pageNumber;
	let pageSize;
	let offset;
	let courseRequired = false;
	let departmentRequired = false;

	if (req.query.hasOwnProperty("filter_status")) {
		filterwhere = {
			...filterwhere,
			status: req.query.filter_status as string,
		};
	}

	if (req.query.hasOwnProperty("filter_name")) {
		const filterName = req.query.filter_name;
		
		// Check if filter_name is a string before trimming
		if (typeof filterName === 'string') {
			const trimmedFilterName = filterName.trim();  // Trim whitespace if any
			
				
			if (trimmedFilterName.includes(" ")) {
				// If filter_name has a space, split into first_name and last_name
				const [firstName, lastName] = trimmedFilterName.split(" ");
				
				filterwhere = {
					...filterwhere,
					[Op.and]: [
						{ first_name: { [Op.like]: `%${firstName}%` } }, // First part in first_name
						{ last_name: { [Op.like]: `%${lastName}%` } },   // Second part in last_name
					]
				};
			} else {
				// If no space, match filter_name against first_name or email
				filterwhere = {
					...filterwhere,
					[Op.or]: [
						{ first_name: { [Op.like]: `%${trimmedFilterName}%` } }, // Name condition
						{ email: { [Op.like]: `%${trimmedFilterName}%` } }, // Email condition
					]
				};
			}
	
			// Proceed with your query, adding filterwhere to the query conditions
		} 
	}
	


	if (req.query.hasOwnProperty("filter_course")) {
		const filtercourseid = Number(req.query.filter_course);

		if (filtercourseid > 0) {
			coursewhere = {
				...coursewhere,
				course_id: filtercourseid,
			};

			courseRequired = true;
		}
	}

	if (req.query.hasOwnProperty("filter_department")) {
		const filterdepartmentid = Number(req.query.filter_department);

		if (filterdepartmentid > 0) {
			coursewhere = {
				...coursewhere,
				department_id: filterdepartmentid,
			};

			departmentRequired = true;
		}
	}

	if (req.query.hasOwnProperty("filter_endyear")) {
		const filterendyear = Number(req.query.filter_endyear);

		if (filterendyear > 0) {
			coursewhere = {
				...coursewhere,
				end_year: filterendyear,
			};

			courseRequired = true;
		}
	}

	if (req.query.hasOwnProperty("page_number")) {
		pageNumber = req.query.page_number; // Page number
	} else {
		pageNumber = 1;
	}

	if (req.query.hasOwnProperty("page_size")) {
		pageSize = req.query.page_size; // Page size
	} else {
		pageSize = 10; // Page size
	}

	offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size

	const users = await Users.findAll({
		include: [
			{
				model: Roles,
				required: false,
				attributes: ["name"],
			},
			{
				model: UserEducation, // Join UserEducation (linked by user_id)
				required: courseRequired,
				where: coursewhere,
			},
		],
		attributes: [
			"id",
			"first_name",
			"last_name",
			"nickname",
			"image",
			"professional_headline",
			"status",
			"gender",
			"email",
			"mobileno",
			"createdAt",
			"middle_name",
			"created_on",
			"batch_start",
			"batch_end",
		],
		where: filterwhere,
		order: [["id", "DESC"]],
		offset: offset, // Set the offset
		limit: Number(pageSize), // Set the limit to the page size
	});

	console.log("users", users);
	const formattedUsers = await Promise.all(
		users.map(async user => {
			const educations = await UserEducation.findAll({
				include: [
					{
						model: Courses,
						required: false,
						attributes: ["course_shortcode"],
					},
					{
						model: Departments, // Join UserEducation (linked by user_id)
						required: false,
						attributes: ["department_shortcode"],
					},
				],
				attributes: ["end_year"],
				where: { user_id: user.id, is_additional: 0 },
				order: [["id", "DESC"]],
			});
			console.log("educations", educations);

			// Define the type for the skill object
			const educationField = await Promise.all(
				educations.map(async education => {
					// const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
					let coursename = "";
					if (education.dataValues && education.dataValues.course) {
						coursename =
							education.dataValues.course.dataValues
								.course_shortcode;
					}

					let departmentname = "";
					if (
						education.dataValues &&
						education.dataValues.department
					) {
						departmentname =
							"," +
							education.dataValues.department.dataValues
								.department_shortcode;
					}
					return (
						coursename +
						" " +
						education.dataValues.end_year +
						departmentname
					);
				}),
			);

			return {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				middle_name: user.middle_name,
				nickname: user.nickname,
				image: user.image,
				gender: user.gender,
				email: user.email,
				mobileno: user.mobileno,
				createdAt: user.dataValues.createdAt,
				status: user.status,
				batch_start: user.batch_start,
				batch_end: user.batch_end,
				role: user.dataValues.role,
				professional_headline: user.professional_headline,
				educationField: educationField, // Include the skills as an array
			};
		}),
	);

	const totalcount = await Users.count({
		distinct: true, // Ensures distinct job IDs are counted
		col: "id",
		include: [
			{
				model: Roles,
				required: false,
			},
			{
				model: UserEducation, // Join UserEducation (linked by user_id)
				required: courseRequired,
				where: coursewhere,
			},
		],
		where: filterwhere,
	});
	res.status(200).json({ total_records: totalcount, data: formattedUsers });
});

userRouter.get("/group_id=:group_id/", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	initializeUEducationModel(getSequelize());
	initializeCourseModel(getSequelize());
	initializeDepartmentModel(getSequelize());
	initializeUGroupModel(getSequelize());

	console.log("req.query.filter_status", req.query.filter_status);
	const instituteId = (req as any).instituteId;

	Users.hasMany(UserGroup, { foreignKey: "user_id" });
	UserGroup.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });

	Users.hasMany(UserEducation, { foreignKey: "user_id" });
	UserEducation.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });

	Courses.hasMany(UserEducation, { foreignKey: "course_id" });
	UserEducation.belongsTo(Courses, {
		foreignKey: "course_id",
		targetKey: "id",
	});

	Departments.hasMany(UserEducation, { foreignKey: "department_id" });
	UserEducation.belongsTo(Departments, {
		foreignKey: "department_id",
		targetKey: "id",
	});

	interface FilterWhere {
		is_alumni: string;
		institute_id: string;
		status: string;
		[key: string]: string | undefined; // Allow additional properties
	}

	interface CourseWhere {
		is_additional: Number;
		[key: string]: Number; // Allow additional properties
	}

	interface GroupWhere {
		group_id: Number;
		[key: string]: Number; // Allow additional properties
	}

	let filterwhere: FilterWhere = {
		is_alumni: "1",
		institute_id: instituteId,
		status: "active",
	};
	let coursewhere: CourseWhere = { is_additional: 0 };
	let groupwhere: GroupWhere = { group_id: Number(req.params.group_id) };
	let pageNumber;
	let pageSize;
	let offset;
	let courseRequired = false;
	let departmentRequired = false;

	if (req.query.hasOwnProperty("filter_status")) {
		filterwhere = {
			...filterwhere,
			status: req.query.filter_status as string,
		};
	}

	if (req.query.hasOwnProperty("filter_name")) {
		filterwhere = {
			...filterwhere,
			[Op.or]: [
				{ first_name: { [Op.like]: `%${req.query.filter_name}%` } }, // Name condition
				{ email: { [Op.like]: `%${req.query.filter_name}%` } }, // Email condition
			],
		};
	}

	if (req.query.hasOwnProperty("page_number")) {
		pageNumber = req.query.page_number; // Page number
	} else {
		pageNumber = 1;
	}

	if (req.query.hasOwnProperty("page_size")) {
		pageSize = req.query.page_size; // Page size
	} else {
		pageSize = 10; // Page size
	}

	offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size

	const users = await Users.findAll({
		include: [
			{
				model: UserGroup,
				required: true,
				where: groupwhere,
			},
			{
				model: UserEducation, // Join UserEducation (linked by user_id)
				required: courseRequired,
				where: coursewhere,
			},
		],
		attributes: [
			"id",
			"first_name",
			"last_name",
			"nickname",
			"image",
			"professional_headline",
			"status",
			"gender",
			"email",
			"mobileno",
			"createdAt",
			"middle_name",
			"created_on",
			"batch_start",
			"batch_end",
		],
		where: filterwhere,
		order: [["id", "DESC"]],
		offset: offset, // Set the offset
		limit: Number(pageSize), // Set the limit to the page size
	});

	console.log("users", users);
	const formattedUsers = await Promise.all(
		users.map(async user => {
			const educations = await UserEducation.findAll({
				include: [
					{
						model: Courses,
						required: false,
						attributes: ["course_shortcode"],
					},
					{
						model: Departments, // Join UserEducation (linked by user_id)
						required: false,
						attributes: ["department_shortcode"],
					},
				],
				attributes: ["end_year"],
				where: { user_id: user.id, is_additional: 0 },
				order: [["id", "DESC"]],
			});
			console.log("educations", educations);

			// Define the type for the skill object
			const educationField = await Promise.all(
				educations.map(async education => {
					// const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
					let coursename = "";
					if (education.dataValues && education.dataValues.course) {
						coursename =
							education.dataValues.course.dataValues
								.course_shortcode;
					}

					let departmentname = "";
					if (
						education.dataValues &&
						education.dataValues.department
					) {
						departmentname =
							"," +
							education.dataValues.department.dataValues
								.department_shortcode;
					}
					return (
						coursename +
						" " +
						education.dataValues.end_year +
						departmentname
					);
				}),
			);

			return {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				middle_name: user.middle_name,
				nickname: user.nickname,
				image: user.image,
				gender: user.gender,
				email: user.email,
				mobileno: user.mobileno,
				createdAt: user.dataValues.createdAt,
				status: user.status,
				batch_start: user.batch_start,
				batch_end: user.batch_end,
				role: user.dataValues.role,
				professional_headline: user.professional_headline,
				educationField: educationField, // Include the skills as an array
			};
		}),
	);

	const totalcount = await Users.count({
		distinct: true, // Ensures distinct job IDs are counted
		col: "id",
		include: [
			{
				model: UserGroup,
				required: true,
				where: groupwhere,
			},
			{
				model: UserEducation, // Join UserEducation (linked by user_id)
				required: courseRequired,
				where: coursewhere,
			},
		],
		where: filterwhere,
	});
	res.status(200).json({ total_records: totalcount, data: formattedUsers });
});

userRouter.get("/event_id=:event_id/", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	initializeUEducationModel(getSequelize());
	initializeCourseModel(getSequelize());
	initializeDepartmentModel(getSequelize());
	initializeEventModel(getSequelize());

	console.log("req.query.filter_status", req.query.filter_status);
	const instituteId = (req as any).instituteId;

	const event = await Events.findOne({

        where: { id: req.params.event_id } });

	Users.hasMany(UserEducation, { foreignKey: "user_id" });
	UserEducation.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });

	Courses.hasMany(UserEducation, { foreignKey: "course_id" });
	UserEducation.belongsTo(Courses, {
		foreignKey: "course_id",
		targetKey: "id",
	});

	Departments.hasMany(UserEducation, { foreignKey: "department_id" });
	UserEducation.belongsTo(Departments, {
		foreignKey: "department_id",
		targetKey: "id",
	});

	const goinguserId: any = event?.join_members as any;
	const maybeuserId: any = event?.maybe_members as any;

	let goinguserIds: number[] = [];
	let maybeuserIds: number[] = [];

	if (typeof goinguserId === "string") {
		try {
			if(goinguserId!=''){
			goinguserIds = JSON.parse(goinguserId); // Parse if it's a JSON string
			}

		} catch (error) {
			console.error("Error parsing JSON:", error);
		}
	} else if (Array.isArray(goinguserId)) {
		goinguserIds = goinguserId; // Assign directly if it's already an array
	}

	if (typeof maybeuserId === "string") {
		try {
			if(maybeuserId!=''){
				maybeuserIds = JSON.parse(maybeuserId); // Parse if it's a JSON string
			}


		} catch (error) {
			console.error("Error parsing JSON:", error);
		}
	} else if (Array.isArray(maybeuserId)) {
		maybeuserIds = maybeuserId; // Assign directly if it's already an array
	}


	interface CourseWhere {
		is_additional: Number;
		[key: string]: Number; // Allow additional properties
	}


	let coursewhere: CourseWhere = { is_additional: 0 };

	let pageNumber;
	let pageSize;
	let offset;
	let courseRequired = false;
	let departmentRequired = false;

	let formattedUsers;
	if(goinguserIds.length>0){
	const users = await Users.findAll({
		include: [
			{
				model: UserEducation, // Join UserEducation (linked by user_id)
				required: courseRequired,
				where: coursewhere,
			},
		],
		attributes: [
			"id",
			"first_name",
			"last_name",
			"nickname",
			"image",
			"professional_headline",
			"status",
			"gender",
			"email",
			"mobileno",
			"createdAt",
			"middle_name",
			"created_on",
			"batch_start",
			"batch_end",
		],
		where: Sequelize.literal(`users.id IN (${goinguserIds.join(",")})`),
		order: [["id", "DESC"]],
	});

	console.log("users", users);
	formattedUsers = await Promise.all(
		users.map(async user => {
			const educations = await UserEducation.findAll({
				include: [
					{
						model: Courses,
						required: false,
						attributes: ["course_shortcode"],
					},
					{
						model: Departments, // Join UserEducation (linked by user_id)
						required: false,
						attributes: ["department_shortcode"],
					},
				],
				attributes: ["end_year"],
				where: { user_id: user.id, is_additional: 0 },
				order: [["id", "DESC"]],
			});
			console.log("educations", educations);

			// Define the type for the skill object
			const educationField = await Promise.all(
				educations.map(async education => {
					// const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
					let coursename = "";
					if (education.dataValues && education.dataValues.course) {
						coursename =
							education.dataValues.course.dataValues
								.course_shortcode;
					}

					let departmentname = "";
					if (
						education.dataValues &&
						education.dataValues.department
					) {
						departmentname =
							"," +
							education.dataValues.department.dataValues
								.department_shortcode;
					}
					return (
						coursename +
						" " +
						education.dataValues.end_year +
						departmentname
					);
				}),
			);

			return {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				middle_name: user.middle_name,
				nickname: user.nickname,
				image: user.image,
				gender: user.gender,
				email: user.email,
				mobileno: user.mobileno,
				createdAt: user.dataValues.createdAt,
				status: user.status,
				batch_start: user.batch_start,
				batch_end: user.batch_end,
				role: user.dataValues.role,
				professional_headline: user.professional_headline,
				educationField: educationField, // Include the skills as an array
			};
		}),
	);
	} else{
		formattedUsers = {};
	}

	let maybeformattedUsers;

	if(maybeuserIds.length>0){
	const maybeusers = await Users.findAll({
		include: [
			{
				model: UserEducation, // Join UserEducation (linked by user_id)
				required: courseRequired,
				where: coursewhere,
			},
		],
		attributes: [
			"id",
			"first_name",
			"last_name",
			"nickname",
			"image",
			"professional_headline",
			"status",
			"gender",
			"email",
			"mobileno",
			"createdAt",
			"middle_name",
			"created_on",
			"batch_start",
			"batch_end",
		],
		where: Sequelize.literal(`users.id IN (${maybeuserIds.join(",")})`),
		order: [["id", "DESC"]],
	});


	maybeformattedUsers = await Promise.all(
		maybeusers.map(async user => {
			const maybeeducations = await UserEducation.findAll({
				include: [
					{
						model: Courses,
						required: false,
						attributes: ["course_shortcode"],
					},
					{
						model: Departments, // Join UserEducation (linked by user_id)
						required: false,
						attributes: ["department_shortcode"],
					},
				],
				attributes: ["end_year"],
				where: { user_id: user.id, is_additional: 0 },
				order: [["id", "DESC"]],
			});
			console.log("educations", maybeeducations);

			// Define the type for the skill object
			const maybeeducationField = await Promise.all(
				maybeeducations.map(async education => {
					// const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
					let coursename = "";
					if (education.dataValues && education.dataValues.course) {
						coursename =
							education.dataValues.course.dataValues
								.course_shortcode;
					}

					let departmentname = "";
					if (
						education.dataValues &&
						education.dataValues.department
					) {
						departmentname =
							"," +
							education.dataValues.department.dataValues
								.department_shortcode;
					}
					return (
						coursename +
						" " +
						education.dataValues.end_year +
						departmentname
					);
				}),
			);

			return {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				middle_name: user.middle_name,
				nickname: user.nickname,
				image: user.image,
				gender: user.gender,
				email: user.email,
				mobileno: user.mobileno,
				createdAt: user.dataValues.createdAt,
				status: user.status,
				batch_start: user.batch_start,
				batch_end: user.batch_end,
				role: user.dataValues.role,
				professional_headline: user.professional_headline,
				educationField: maybeeducationField, // Include the skills as an array
			};
		}),
	);
	} else{
		maybeformattedUsers = {};
	}


	res.status(200).json({ maybeMembers: maybeformattedUsers, joinMembers: formattedUsers });
});

userRouter.get("/me", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	const instituteId = (req as any).instituteId;

	const user = await Users.findOne({
		where: { id: req.body.sessionUser.id },
	});

	if (!user) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}

	let userinstitute;

	if(user.is_admin==2){

		userinstitute = user;

	} else{

		userinstitute = await Users.findOne({
			where: { id: req.body.sessionUser.id, institute_id: instituteId },
		});

	}

	if (!userinstitute) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}

	console.log("user", userinstitute);
	const userDetails = JSON.parse(JSON.stringify(userinstitute));
	delete userDetails.password;

	res.json(userDetails);
});

userRouter.get("/:id", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	initializeCountryModel(getSequelize());
	initializeStateModel(getSequelize());
	initializeUEducationModel(getSequelize());
	initializeCourseModel(getSequelize());
	initializeDepartmentModel(getSequelize());
	console.log("req.params.id", req.params.id);
	const instituteId = (req as any).instituteId;

	Countrys.hasMany(Users, { foreignKey: "country_id" });
	Users.belongsTo(Countrys, { foreignKey: "country_id", targetKey: "id" });

	States.hasMany(Users, { foreignKey: "state_id" });
	Users.belongsTo(States, { foreignKey: "state_id", targetKey: "id" });

	// Add another association with alias for country2
	if (!Users.associations.Country2) {
		Users.belongsTo(Countrys, {
			foreignKey: "country2_id",
			targetKey: "id",
			as: "Country2",
		});
	}

	if (!Users.associations.State2) {
		Users.belongsTo(States, {
			foreignKey: "state2_id",
			targetKey: "id",
			as: "State2",
		});
	}

	const user = await Users.findOne({
		include: [
			{
				model: Countrys,
				required: false,
				attributes: ["country_name"],
			},
			{
				model: States, // Join UserEducation (linked by user_id)
				required: false,
				attributes: ["state_name"],
			},
			{
				model: Countrys,
				as: "Country2", // Alias for second join
				required: false,
				attributes: ["country_name"],
			},
			{
				model: States,
				as: "State2", // Alias for second join
				required: false,
				attributes: ["state_name"],
			},
		],
		where: { id: req.params.id, institute_id: instituteId },
	});
	console.log("user", user);
	const userDetails = JSON.parse(JSON.stringify(user));
	delete userDetails.password;

	// Second method to get data
	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);

	const educations = await UserEducation.findAll({
		include: [
			{
				model: Courses,
				required: false,
				attributes: ["course_shortcode"],
			},
			{
				model: Departments, // Join UserEducation (linked by user_id)
				required: false,
				attributes: ["department_shortcode"],
			},
		],
		attributes: ["end_year"],
		where: { user_id: user?.id, is_additional: 0 },
		order: [["id", "DESC"]],
	});

	const educationField = await Promise.all(
		educations.map(async education => {
			// const coursename = education.dataValues.course.map((course: any) => course.dataValues.course_shortcode);
			let coursename = "";
			if (education.dataValues && education.dataValues.course) {
				coursename =
					education.dataValues.course.dataValues.course_shortcode;
			}

			let departmentname = "";
			if (education.dataValues && education.dataValues.department) {
				departmentname =
					"," +
					education.dataValues.department.dataValues
						.department_shortcode;
			}
			return (
				coursename +
				" " +
				education.dataValues.end_year +
				departmentname
			);
		}),
	);

	if (!user) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}
	res.json({
		message: "User Details",
		data: userDetails,
		education: educationField,
	});
});

userRouter.post("/login", async (req, res) => {
	initializeUserModel(getSequelize());
	console.log("req", req.body);
	const { email, password } = req.body;

	const user = await Users.findOne({ where: { email: email} });
	// Second method to get data
	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!user) {
		res.status(500).json({ message: "Invalid email and passwordsfdsfds" });
		return;
	}

	let userinstitute;
	if (user) {

		if(user.is_admin==2){

			userinstitute = user;

		} else{

			const instituteId = (req as any).instituteId;

			userinstitute = await Users.findOne({
				where: { id: user.id, institute_id: instituteId },
			});

			if (!userinstitute) {
				res.status(500).json({ message: "Invalid email and password" });
				return;
			}

			if(userinstitute.status=='inactive' || userinstitute.status=='rejected'){
				res.status(500).json({ message: "Account is not activated" });
				return;
			}

		}
	}

	// Decrypt password which send from FE
	/* const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_ENCRYPT_KEY || "");
    const decPassword = bytes.toString(CryptoJS.enc.Utf8);
    const comparision = await bcrypt.compare(decPassword, user.password); */

	console.log("password, user.password", password, userinstitute.password);
	const comparision = await bcrypt.compare(password, userinstitute.password);
	if (comparision) {
		const userId = { id: userinstitute.id, email: userinstitute.email };
		const token = jwt.sign(userId, process.env.JWT_KEY || "", {
			expiresIn: "24h",
		});
		const serialized = serialize("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: 60 * 60,
			path: "/",
		});
		res.setHeader("Set-Cookie", serialized);

		res.json({ message: "LOGIN SUCCESS", user: userinstitute });
	} else {
		// res.send({ success: false, message: "Email and password does not match" })
		return res.status(401).json({
			message: "you_ve_entered_an_incorrect_email_password",
		});
	}

	// res.send('Hello, World!');
});

userRouter.post("/change-password", async (req, res) => {
	initializeUserModel(getSequelize());
	console.log("req", req.body);
	const { user_id, current_password, password, confirm_password } = req.body;

	const user = await Users.findOne({ where: { id: user_id } });
	// Second method to get data
	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!user) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}

	if (user) {
		if(user.status=='inactive' || user.status=='rejected'){
			res.status(500).json({ message: "Account is not activated" });
			return;
		}

	}

	if (!current_password || !password || !confirm_password) {
		res.status(500).json({ message: "All fields are required." });
		return;

	  }

	  if (password !== confirm_password) {
		return res
		  .status(500)
		  .json({ message: "New password and confirm password do not match." });

	  }

	  const passwordMatch = await bcrypt.compare(current_password, user.password);
    if (!passwordMatch) {
      return res
        .status(500)
        .json({ message: "Current password is incorrect." });
    }

	const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Update password
    const usernew = await user.update({ password: hashedPassword });

	// Decrypt password which send from FE
	/* const bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_ENCRYPT_KEY || "");
    const decPassword = bytes.toString(CryptoJS.enc.Utf8);
    const comparision = await bcrypt.compare(decPassword, user.password); */


	if (passwordMatch) {
		const userId = { id: user.id, email: user.email };
		const token = jwt.sign(userId, process.env.JWT_KEY || "", {
			expiresIn: "24h",
		});
		const serialized = serialize("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60,
			path: "/",
		});
		res.setHeader("Set-Cookie", serialized);

		res.json({ message: "Password updated successfully.", user: user });
	} else {
		// res.send({ success: false, message: "Email and password does not match" })
		return res.status(401).json({
			message: "something_went_wrong",
		});
	}

	// res.send('Hello, World!');
});

userRouter.post("/forgot_password", async (req, res) => {
	initializeUserModel(getSequelize());
	initializeEmailTemplateModel(getSequelize());
    initializeInstitutesModel(getSequelize());

	console.log("req", req.body);
	const { email } = req.body;

	const origin = req.get('origin');



	const instituteId = (req as any).instituteId;

	const user = await Users.findOne({ where: { email: email, institute_id: instituteId } });
	// Second method to get data
	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!user) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}

	const emailtemplate = await EmailTemplates.findOne({
		order: [["id", "DESC"]],
		offset: 0, // Set the offset
		limit: 1, // Set the limit to the page size
	});

	const institutedata = await Institutes.findOne({ where: { id: instituteId } });

	const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1-hour expiration

	user.resetPasswordToken = token;
	user.resetPasswordExpires = expiration;
	await user.save();

	const reseturl = origin+"/password_reset/"+token;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const subject = "Password Reset";

	try {

		const dynamicValues = {
			"[User Name]": user.first_name+" "+user.last_name,
			"[Reset Link]": reseturl,
			"[Your Company Name]": institutedata?.institute_name,
			"[Year]": new Date().getFullYear(),
		};

		const emailTemplate = emailtemplate?.alumni_reset_password_mail as any;
		const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
				   .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
				   .replace(/\[Reset Link\]/g, dynamicValues["[Reset Link]"])
				   .replace(/\[Year\]/g, dynamicValues["[Year]"]);

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: subject,
			html: finalHtml,
			headers: {
				'Content-Type': 'text/html; charset=UTF-8',
			  },
		});
		res.json({ message: "Email Sent Successfully", data: user });
	} catch (err) {
		console.error(`Failed to send email to ${user.email}:`, err);
	}



	// res.send('Hello, World!');
});

userRouter.post("/reset_password/:key", async (req, res) => {
	initializeUserModel(getSequelize());
	console.log("req", req.body);
	const key  = req.params.key;
    const { password } = req.body;


	const user = await Users.findOne({
		where: {
		  resetPasswordToken: key,
		  resetPasswordExpires: { [Op.gt]: new Date() }, // Check expiration
		},
	  });
	// Second method to get data
	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!user) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}

	if (user) {
		if(user.status=='inactive' || user.status=='rejected'){
			res.status(500).json({ message: "Account is not activated" });
			return;
		}

	}



	const hashedPassword = await bcrypt.hash(password, 10);

	user.password = hashedPassword;
  	user.resetPasswordToken = "";
  	user.resetPasswordExpires = null as any;

  	await user.save();
	  res.json({ message: 'Password has been reset successfully' });

	// res.send('Hello, World!');
});

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     description: User information
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

userRouter.delete("/:id", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	console.log("req.params.id", req.params.id);
	const instituteId = (req as any).instituteId;

	const user = await Users.findOne({
		where: { id: req.params.id, institute_id: instituteId },
	});

	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!user) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}

	try {
		await Users.destroy({
			where: { id: req.params.id },
		});
		res.status(200).json({
			status: "success",
			message: "Delete User Successfully",
		});
	} catch (err) {
		res.status(500).json({ message: "Invalid User" });
		return;
	}
});

userRouter.post("/status", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	initializeEmailTemplateModel(getSequelize());
	initializeInstitutesModel(getSequelize());
	console.log("req.params.id", req.params.id);


	const emailtemplate = await EmailTemplates.findOne({
		order: [["id", "DESC"]],
		offset: 0, // Set the offset
		limit: 1, // Set the limit to the page size
	});

	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);


	try {
		const { id, status } = req.body;

		const instituteId = (req as any).instituteId;

		const user = await Users.findOne({ where: { id: id } });


		const institutedata = await Institutes.findOne({ where: { id: instituteId } });

		console.log("institutedata",institutedata);

		if (!user) {
			res.status(500).json({ message: "Invalid User" });
			return;
		}

		const usernew = await Users.update(
			{
				status,
			},
			{
				where: { id: id },
			},
		);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const notFoundEmails: string[] = [];

		// Use Promise.all() to send emails in parallel
		let subject;

		if(status=='active'){
			subject = "Your account has been activated";
		}
		else if(status=='rejected'){
			subject = "Your account has been rejected";
		} else{
			subject = "Your account has been deactivated";
		}

			if (user) {
				try {

					const dynamicValues = {
						"[User Name]": user.first_name+" "+user.last_name,
						"[subject]": subject,
						"[Your Company Name]": institutedata?.institute_name,
						"[Year]": new Date().getFullYear(),
					};

					const emailTemplate = emailtemplate?.alumni_confirm_mail as any;
					const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
                               .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
							   .replace(/\[subject\]/g, dynamicValues["[subject]"])
                               .replace(/\[Year\]/g, dynamicValues["[Year]"]);

					await transporter.sendMail({
						from: process.env.EMAIL_USER,
						to: user.email,
						subject: subject,
						html: finalHtml,
						headers: {
							'Content-Type': 'text/html; charset=UTF-8',
						  },
					});
				} catch (err) {
					console.error(`Failed to send email to ${user.email}:`, err);
				}
			}

		res.json({ message: "Status Updated Successfully", data: user });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/profilepic", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const { id, image } = req.body;

		const user = await Users.update(
			{
				image,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "Profile Picture Updated", data: user });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/proheadline", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const { id, professional_headline } = req.body;

		const user = await Users.update(
			{
				professional_headline,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "Professional Headline Updated", data: user });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/socialuser", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const {
			id,
			linkedin_url,
			facebook_url,
			twitter_url,
			instagram_url,
			youtube_url,
		} = req.body;

		const user = await Users.update(
			{
				linkedin_url,
				facebook_url,
				twitter_url,
				instagram_url,
				youtube_url,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "Contact Details Updated", data: user });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/basicprofileupdate", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const {
			id,
			first_name,
			middle_name,
			last_name,
			salutation,
			nickname,
			gender,
			dob,
			relationship_status,
			about_me,
		} = req.body;

		const user = await Users.update(
			{
				first_name,
				middle_name,
				last_name,
				salutation,
				nickname,
				gender,
				dob,
				relationship_status,
				about_me,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "Basic Profile Updated", data: user });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/locationprofileupdate", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const {
			id,
			address1,
			city,
			state_id,
			country_id,
			address2,
			city2,
			state2_id,
			country2_id,
			country_mobileno_code,
			mobileno,
			country_workno_code,
			work_phone_no,
			email_alternate,
			linkedin_url,
			facebook_url,
			twitter_url,
			instagram_url,
			youtube_url,
		} = req.body;

		const user = await Users.update(
			{
				address1,
				city,
				state_id,
				country_id,
				address2,
				city2,
				state2_id,
				country2_id,
				country_mobileno_code,
				mobileno,
				country_workno_code,
				work_phone_no,
				email_alternate,
				linkedin_url,
				facebook_url,
				twitter_url,
				instagram_url,
				youtube_url,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "Location Profile Updated", data: user });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/alumnisendmessage", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const { id, subject, message_desc, sender_id, receiver_id, status } =
			req.body;

		const institute_id = (req as any).instituteId;
		const alumnimessage = await AlumniMessage.create({
			institute_id,
			subject,
			message_desc,
			sender_id,
			receiver_id,
			status,
		});
		res.json({ message: "Message Sent", data: alumnimessage });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/accountdeleterequest", auth, async (req, res) => {
	initializeUserModel(getSequelize());
	try {
		const { id, user_id, mobile_no, delete_message } = req.body;

		const accountdelete = await AccountDeleteRequest.create({
			user_id,
			mobile_no,
			delete_message,
		});
		res.json({ message: "Request Sent", data: accountdelete });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/create", async (req, res) => {
	initializeUserModel(getSequelize());
	initializeEmailTemplateModel(getSequelize());
	initializeUEducationModel(getSequelize());
    initializeDepartmentModel(getSequelize());
    initializeCourseModel(getSequelize());
    initializeGroupModel(getSequelize());
    initializeUGroupModel(getSequelize());
    initializeInstitutesModel(getSequelize());

	const emailtemplate = await EmailTemplates.findOne({
		order: [["id", "DESC"]],
		offset: 0, // Set the offset
		limit: 1, // Set the limit to the page size
	});

	try {
		const {
			id,
			email,
			password,
			first_name,
			middle_name,
			last_name,
			role_id,
			is_alumni,
			gender,
			course_id,
			department_id,
			end_year,
			specialization,
			address1,
			city,
			state_id,
			country_id,
			country_mobileno_code,
			mobileno,
			image,
			linkedin_url,
			facebook_url,
			twitter_url,
			instagram_url,
			youtube_url,
			status,
			about_me,
		} = req.body;
		console.log("req.body", req.body);
		const institute_id = (req as any).instituteId;


		const institutedata = await Institutes.findOne({ where: { id: institute_id } });

		console.log("institutedata",institutedata);

		


		let user: Users | null;
		if (id) {
			user = await Users.findOne({
				where: {
					email: email,
					institute_id: institute_id,
					id: { $not: id },
				},
			});
			console.log("user>>>>>>>>>>>>>>>>", user);
		} else {
			user = await Users.findOne({
				where: { email: email, institute_id: institute_id },
			});
		}
		if (user) {
			res.status(500).json({ message: "Email already exist." });
			return;
		}

		if (id) {
			const user = await Users.update(
				{
					email,
					first_name,
					middle_name,
					last_name,
					role_id,
					is_alumni,
					gender,
					address1,
					city,
					state_id,
					country_id,
					country_mobileno_code,
					mobileno,
					image,
					linkedin_url,
					facebook_url,
					twitter_url,
					instagram_url,
					youtube_url,
					status,
					about_me,
				},
				{
					where: { id: id },
				},
			);
			res.json({ message: "User Updated", data: user });
		} else {
			bcrypt.hash(password, 10, async (err, hash) => {
				if (err) {
					return res.status(500).json({
						message: err,
					});
				} else {
					// const password = new_item.password;
					// const saltRounds = 10;
					// new_item.password = await bcrypt.hash(password, saltRounds)
					const institute_id = (req as any).instituteId;

					const user = await Users.create({
						institute_id,
						email,
						password: hash,
						first_name,
						middle_name,
						last_name,
						role_id,
						is_alumni,
						gender,
						address1,
						city,
						state_id,
						country_id,
						country_mobileno_code,
						mobileno,
						image,
						linkedin_url,
						facebook_url,
						twitter_url,
						instagram_url,
						youtube_url,
						status,
						about_me,
					});
					if(is_alumni==1){
						
					const yeargroupname = "Batch of "+end_year;
					const university = institutedata?.institute_name;
					const user_id = user.id;
					const degree = "";
					const is_additional = 0;
					const start_year = 0;
					const location = "";

					const alumnimessage = await UserEducation.create({
						user_id,
						university,
						degree,
						course_id,
						department_id,
						specialization,
						is_additional,
						start_year,
						end_year,
						location
					});

					const adminuser = await Users.findOne({ where: { is_admin: 1, status: "active", institute_id: institute_id } });

					const group = await Groups.findOne({ where: { group_name: yeargroupname, institute_id: institute_id } });

					const coursename = await Courses.findOne({ where: { id: course_id } });

					const departname = await Departments.findOne({ where: { id: department_id } });

					let coursegroupname;
					let depart_name;

					if(departname){
						coursegroupname = coursename?.course_shortcode+" "+end_year+", "+departname?.department_shortcode;
						depart_name = departname.department_name;
					} else{
						coursegroupname = coursename?.course_shortcode+" "+end_year;
						depart_name = '';
					}


					const coursegroup = await Groups.findOne({ where: { group_name: coursegroupname, institute_id: institute_id } });

					if(group){
						var group_id = group.id;
						const usergroupdata = await UserGroup.findOne({ where: { user_id: user_id, group_id: group_id } });
						if(!usergroupdata){
						const usergroup = await UserGroup.create({
							user_id,
							group_id,
						});
						}
					} else{
						const group_name= yeargroupname;
						const groupdata = await Groups.create({
							institute_id,
							group_name
						});
						var group_id = groupdata.id;
						const usergroup = await UserGroup.create({
							user_id,
							group_id,
						});
					}

					if(coursegroup){
						var group_id = coursegroup.id;
						const usergroupdata = await UserGroup.findOne({ where: { user_id: user_id, group_id:group_id } });
						if(!usergroupdata){
						const usergroup = await UserGroup.create({
							user_id,
							group_id,
						});
						}
					} else{
						const group_name= coursegroupname;
						const groupdata = await Groups.create({
							institute_id,
							group_name
						});
						var group_id = groupdata.id;
						const usergroup = await UserGroup.create({
							user_id,
							group_id,
						});
					}

					const transporter = nodemailer.createTransport({
						service: "gmail",
						auth: {
							user: process.env.EMAIL_USER,
							pass: process.env.EMAIL_PASS,
						},
					});

					const notFoundEmails: string[] = [];

					// Use Promise.all() to send emails in parallel
					let subject;
					let subjectAdmin;



						subject = "Welcome to "+institutedata?.institute_name;

						subjectAdmin = "New Alumni Registered";


							try {

								const dynamicValues = {
									"[User Name]": first_name+" "+last_name,
									"[Your Company Name]": institutedata?.institute_name,
									"[Year]": new Date().getFullYear(),
									"[Email]": email,
									"[Course Name]": coursename?.course_name,
									"[Department Name]": depart_name,
									"[Batch End Year]": end_year,
								};

								const emailTemplate = emailtemplate?.alumni_register_mail as any;
								const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
										   .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
										   .replace(/\[Year\]/g, dynamicValues["[Year]"]);

								const emailAdminTemplate = emailtemplate?.alumni_register_mail_admin as any;
								const finalAdminHtml = emailAdminTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])
													  .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
													  .replace(/\[Email\]/g, dynamicValues["[Email]"])
													  .replace(/\[Course Name\]/g, dynamicValues["[Course Name]"])
													  .replace(/\[Department Name\]/g, dynamicValues["[Department Name]"])
													  .replace(/\[Batch End Year\]/g, dynamicValues["[Batch End Year]"])
													  .replace(/\[Year\]/g, dynamicValues["[Year]"]);

								await transporter.sendMail({
									from: process.env.EMAIL_USER,
									to: email,
									subject: subject,
									html: finalHtml,
									headers: {
										'Content-Type': 'text/html; charset=UTF-8',
									  },
								});

								await transporter.sendMail({
									from: process.env.EMAIL_USER,
									to: adminuser?.email,
									subject: subjectAdmin,
									html: finalAdminHtml,
									headers: {
										'Content-Type': 'text/html; charset=UTF-8',
									  },
								});
							} catch (err) {
								console.error(`Failed to send email to ${email}:`, err);
							}

						}
					res.json({ message: "User Created", data: user });
				}
			});
		}
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

userRouter.post("/logout", async (req, res) => {
	initializeUserModel(getSequelize());
	const { cookies } = req;

	const jwt = cookies.token;

	if (!jwt) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	const tokenSerialized = serialize("token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "none",
		maxAge: -1,
		path: "/",
	});

	const instituteIdSerialized = serialize("institute_id", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: -1,
		path: "/",
	});

	res.setHeader("Set-Cookie", [tokenSerialized, instituteIdSerialized]);
	res.status(200).json({
		status: "success",
		message: "Logged out",
	});
});

userRouter.post(
	"/upload",
	auth,
	upload.fields([{ name: "file", maxCount: 10 }]),
	async (req, res) => {
		console.log("req.files", req.files);
		console.log("req.body", req.body);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const files: any = req.files;
		/* if (req.files) {
        req.body.file = req.files.file && req.files.file.length ? req.files.file[0].filename : '';
    }
    req.body.created_by = req.body.sessionUser.id; */
		/*
        var role = '';
        if (!req.body.from_profile) {
            role = JSON.parse(req.body.role);
            req.body.role = role.filter(item => item.status == 'active').map(item => item.name).toString();
        } */

		res.status(200).json({
			message: "Upload Success",
			files: files?.file,
		});
	},
);

// userRouter.post("/send-email", async (req, res) => {
// 	initializeUserModel(getSequelize());
// 	const { recipients, subject, message } = req.body;

// 	if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
// 		return res.status(400).json({ message: "No recipients provided." });
// 	}

// 	try {
// 		// Configure Nodemailer transporter
// 		const transporter = nodemailer.createTransport({
// 			service: "gmail",
// 			auth: {
// 				user: process.env.EMAIL_USER,
// 				pass: process.env.EMAIL_PASS,
// 			},
// 		});

// 		const sentEmails: string[] = [];
// 		const notFoundEmails: string[] = [];

// 		// Process each recipient
// 		for (const email of recipients) {
// 			const user = await Users.findOne({ where: { email } });

// 			if (user) {
// 				try {
// 					await transporter.sendMail({
// 						from: process.env.EMAIL_USER,
// 						to: email,
// 						subject: subject,
// 						html: `
//               <p>Hello, ${user.first_name || "User"}</p>
//               <p>${message}</p>
//               <p>Thank you,<br>Your App Team</p>
//             `,
// 					});

// 					sentEmails.push(email);
// 				} catch (err) {
// 					console.error(`Failed to send email to ${email}:`, err);
// 				}
// 			} else {
// 				notFoundEmails.push(email);
// 			}
// 		}

// 		// Response summarizing the result
// 		return res.status(200).json({
// 			message: "Emails processed.",
// 			sentEmails,
// 			notFoundEmails,
// 		});
// 	} catch (error) {
// 		console.error("Error in send-email route:", error);
// 		return res.status(500).json({ message: "Internal server error." });
// 	}
// });



export default userRouter;
