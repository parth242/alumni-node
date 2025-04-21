import express from "express";
import BusinessDirectorys, {
	initializeBusinessDirectoryModel,
} from "../models/BusinessDirectory";
import { getSequelize } from "../config/db";
import Users, { initializeUserModel } from "../models/User";
import Industries, { initializeIndustryModel } from "../models/Industry";
import { catchError } from "../common/functions";
import { auth } from "../middleware/auth";
import { Op, WhereOptions } from "sequelize";
import Services, { initializeServicesModel } from "../models/Services";
import Products, { initializeProductsModel } from "../models/Products";

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })

const businessdirectoryRouter = express.Router();

businessdirectoryRouter.get("/", auth, async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	initializeIndustryModel(getSequelize());
	initializeUserModel(getSequelize());

	Industries.hasMany(BusinessDirectorys, { foreignKey: "industry_id" });
	BusinessDirectorys.belongsTo(Industries, {
		foreignKey: "industry_id",
		targetKey: "id",
	});

	Users.hasMany(BusinessDirectorys, { foreignKey: "user_id" });
	BusinessDirectorys.belongsTo(Users, {
		foreignKey: "user_id",
		targetKey: "id",
	});

	const institute_id = (req as any).instituteId;

	interface FilterWhere {
		user_id: number;
	}

	let whereCondition: WhereOptions<any> = {};
	let pageNumber;
	let pageSize;
	let offset;

	if (institute_id > 0) {
		whereCondition.institute_id = institute_id as string;
	}

	
	whereCondition.status = "active";

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

	const businessdirectorys = await BusinessDirectorys.findAll({
		include: [
			{
				model: Industries,
				required: true, // Ensures only Jobs with JobSkills are returned
				attributes: ["industry_name"], // Fetch the skill_name
			},
			{
				model: Users,
				required: false, // Ensures only Jobs with JobSkills are returned
				attributes: ["first_name","last_name","image"], // Fetch the skill_name
			},
		],
		where: whereCondition, // Your conditions for filtering BusinessDirectorys
		order: [["id", "DESC"]],
		offset: offset, // Pagination offset
		limit: Number(pageSize), // Pagination limit
	});

	const totalcount = await BusinessDirectorys.count({
		include: [
			{
				model: Industries,
				required: true, // Ensures only Jobs with JobSkills are returned
				attributes: ["industry_name"], // Fetch the skill_name
			},
			{
				model: Users,
				required: false // Ensures only Jobs with JobSkills are returned
				
			},
		],
		distinct: true, // Ensures distinct businessdirectory IDs are counted
		col: "id",
		where: whereCondition,
	});

	const businessdirectorysall = await BusinessDirectorys.findAll({
		include: [
			{
				model: Industries,
				required: true, // Ensures only Jobs with JobSkills are returned
				attributes: ["industry_name"], // Fetch the skill_name
			},
		],
		order: [["id", "DESC"]],
		where: { status: "active" },
	});

	res.status(200).json({
		total_records: totalcount,
		data: businessdirectorys,
		total_data: businessdirectorysall,
	});
});

businessdirectoryRouter.get("/:id", auth, async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	initializeIndustryModel(getSequelize());

	const businessdirectory = await BusinessDirectorys.findOne({
		where: { id: req.params.id, status: "active" },
		include: [
			{
				model: Industries,
				required: true,
				attributes: ["industry_name"],
			},
		],
	});

	if (!businessdirectory) {
		res.status(500).json({
			message: "BusinessDirectory not found or already deleted",
		});
		return;
	} else {
		res.json({
			message: "BusinessDirectory Details",
			data: businessdirectory,
		});
	}
});

// businessdirectoryRouter.get("/:id", auth, async (req, res) => {
//     initializeBusinessDirectoryModel(getSequelize());

//     const businessdirectory = await BusinessDirectorys.findOne({
//         where: { id: req.params.id },
//     });

//     if (!businessdirectory) {
//         res.status(500).json({ message: "Invalid BusinessDirectory" });
//         return;
//     } else {
//         res.json({
//             message: "BusinessDirectory Details",
//             data: businessdirectory,
//         });
//     }
// });

/**
 *
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

businessdirectoryRouter.delete("/:id", auth, async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	console.log("req.params.id", req.params.id);

	const event = await BusinessDirectorys.findOne({
		where: { id: req.params.id },
	});

	// const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
	if (!event) {
		res.status(500).json({ message: "Invalid BusinessDirectory" });
		return;
	}

	try {
		await BusinessDirectorys.update(
			{ status: "deleted" },
			{ where: { id: req.params.id } },
		);
		res.status(200).json({
			status: "success",
			message: "Delete BusinessDirectory Successfully",
		});
	} catch (err) {
		res.status(500).json({ message: "Invalid BusinessDirectory" });
		return;
	}
});

businessdirectoryRouter.post("/create", async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	try {
		const {
			id,
			business_name,
			business_website,
			contact_number,
			industry_id,
			number_of_employees,
			founded,
			location,
			business_email,
			description,
			is_member_association,
			business_logo,
			user_id,
			status,
			social_facebook,
			social_instagram,
			social_linkedin,
			social_twitter,
			social_youtube,
		} = req.body;
		const institute_id = (req as any).instituteId;
		console.log("req.body", req.body);
		if (id) {
			console.log("id", id);
			// Construct update fields only with properties available in req.body
			const updateFields: Partial<BusinessDirectorys> = {
				institute_id,
				business_name,
				business_website,
				contact_number,
				industry_id,
				number_of_employees,
				founded,
				location,
				business_email,
				description,
				is_member_association,
				business_logo,
				user_id,
				status,
			};

			// Add social fields only if they are provided in the request
			if (social_facebook !== undefined)
				updateFields.social_facebook = social_facebook;
			if (social_instagram !== undefined)
				updateFields.social_instagram = social_instagram;
			if (social_linkedin !== undefined)
				updateFields.social_linkedin = social_linkedin;
			if (social_twitter !== undefined)
				updateFields.social_twitter = social_twitter;
			if (social_youtube !== undefined)
				updateFields.social_youtube = social_youtube;

			const [updateCount] = await BusinessDirectorys.update(
				updateFields,
				{
					where: { id: id },
				},
			);
			console.log("updateFields", updateFields);
			if (updateCount > 0) {
				res.json({
					message: "BusinessDirectory Updated",
					data: updateFields,
				});
			} else {
				res.status(404).json({
					message: "BusinessDirectory not found",
				});
			}
		} else {
			const businessdirectory = await BusinessDirectorys.create({
				institute_id,
				business_name,
				business_website,
				contact_number,
				industry_id,
				number_of_employees,
				founded,
				location,
				business_email,
				description,
				is_member_association,
				business_logo,
				user_id,
				status,
				social_facebook: social_facebook || "",
				social_instagram: social_instagram || "",
				social_linkedin: social_linkedin || "",
				social_twitter: social_twitter || "",
				social_youtube: social_youtube || "",
			});
			res.json({
				message: "BusinessDirectory Created",
				data: businessdirectory,
			});
		}
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});

businessdirectoryRouter.patch("/update-members", async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	try {
		const { id, members } = req.body;
		console.log("member_ids", members);
		// Make sure id and members are provided in the request
		if (!id || !members) {
			return res.status(400).json({
				message: "Business ID and members are required",
			});
		}

		// Find the business directory by ID
		const businessDirectory = await BusinessDirectorys.findOne({
			where: { id: id },
		});

		if (!businessDirectory) {
			return res.status(404).json({
				message: "Business Directory not found",
			});
		}

		const membersString = members.map(item => item.id).join(",");

		businessDirectory.member_ids = membersString;
		await businessDirectory.save();

		return res.json({
			message: "Business Directory members updated successfully",
			data: {
				id,
				members: membersString,
			},
		});
	} catch (error) {
		console.error("Error updating members:", error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error,
		});
	}
});

businessdirectoryRouter.patch("/update-services", async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	initializeServicesModel(getSequelize());
	try {
		const { id, services } = req.body;

		// Make sure id and services are provided in the request
		if (!id || !services) {
			return res.status(400).json({
				message: "Business ID and services are required",
			});
		}

		// Find the business directory by ID
		const businessDirectory = await BusinessDirectorys.findOne({
			where: { id: id },
		});

		if (!businessDirectory) {
			return res.status(404).json({
				message: "Business Directory not found",
			});
		}

		const customServices = services.filter(item => item.isCustom);
		for (let index = 0; index < customServices.length; index++) {
			const serviceExist = await Services.findOne({
				where: { service_name: customServices[index].name.trim() },
			});
			if (!serviceExist) {
				await Services.create({
					service_name: customServices[index].name,
					is_custom: true,
				});
			}
		}
		const servicesString = services.map(item => item.name).join(",");

		businessDirectory.services = servicesString;
		await businessDirectory.save(); // Save the updated business directory

		return res.json({
			message: "Business Directory services updated successfully",
			data: {
				id,
				services: servicesString,
			},
		});
	} catch (error) {
		console.error("Error updating services:", error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error,
		});
	}
});

businessdirectoryRouter.patch("/update-products", async (req, res) => {
	initializeBusinessDirectoryModel(getSequelize());
	initializeProductsModel(getSequelize());
	try {
		const { id, products } = req.body;

		// Make sure id and products are provided in the request
		if (!id || !products) {
			return res.status(400).json({
				message: "Business ID and products are required",
			});
		}

		// Find the business directory by ID
		const businessDirectory = await BusinessDirectorys.findOne({
			where: { id: id },
		});

		if (!businessDirectory) {
			return res.status(404).json({
				message: "Business Directory not found",
			});
		}

		const customProducts = products.filter(item => item.isCustom);
		for (let index = 0; index < customProducts.length; index++) {
			const productsExist = await Products.findOne({
				where: { product_name: customProducts[index].name.trim() },
			});
			if (!productsExist) {
				await Products.create({
					product_name: customProducts[index].name,
					is_custom: true,
				});
			}
		}
		// Join the updated products into a comma-separated string
		const productNamesString = products.map(item => item.name).join(",");

		// Update the products field in the database
		businessDirectory.products = productNamesString;
		await businessDirectory.save(); // Save the updated business directory

		return res.json({
			message: "Business Directory products updated successfully",
			data: {
				id,
				products: productNamesString,
			},
		});
	} catch (error) {
		console.error("Error updating products:", error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error,
		});
	}
});

export default businessdirectoryRouter;
