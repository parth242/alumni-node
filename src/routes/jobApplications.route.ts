import express from "express";

import { getSequelize } from "../config/db";
import JobApplication, {
	initializeJobApplicationModel,
} from "../models/JobApplication";
import { Op,WhereOptions,Sequelize } from 'sequelize';
import Professionalskills, { initializeSkillModel } from "../models/Professionalskill";
import Jobs, { initializeJobModel } from '../models/Job';
import EmailTemplates , { initializeEmailTemplateModel } from '../models/EmailTemplate';
import Institutes , { initializeInstitutesModel } from '../models/Institute';
import Users, { initializeUserModel } from "../models/User";
import { auth } from '../middleware/auth';
import { catchError } from "../common/functions";
import nodemailer from "nodemailer";

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })
const jobApplicationsRouter = express.Router();

jobApplicationsRouter.get('/', auth, async (req, res) => {
    initializeJobApplicationModel(getSequelize());
    initializeJobModel(getSequelize());

        Jobs.hasMany(JobApplication, {foreignKey: 'job_id'});
        JobApplication.belongsTo(Jobs, {foreignKey: 'job_id', targetKey: 'id'});
        

        const institute_id = (req as any).instituteId;
       

    let whereCondition: WhereOptions<any> = {};
    let pageNumber;
    let pageSize;
    let offset;

    if (institute_id>0) {
       
        
        whereCondition.institute_id = institute_id as string;
       
    }

    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);

    if (filteruserid > 0) {
        const filteruserid = req.query.user_id;
        whereCondition.user_id = filteruserid;             
        }
    }

    if (req.query.hasOwnProperty('job_id')) {           
        
        whereCondition.job_id = req.query.job_id;          
        
    }
    
    if(req.query.hasOwnProperty('page_number')){
        pageNumber = req.query.page_number; // Page number
    } else{
        pageNumber = 1;
    }

    if(req.query.hasOwnProperty('page_size')){
        pageSize = req.query.page_size; // Page size
    } else{
        pageSize = 10; // Page size
    }
    

    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size

   
    const jobapplications = await JobApplication.findAll({ 
        include: [
            {
                model: Jobs,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['job_title'], // Fetch the job_title     
				where: { user_id: req.body.sessionUser.id}           
            }            
        ],
        where: whereCondition, // Your conditions for filtering Jobs
        order: [['id', 'DESC']],
        offset: offset, // Pagination offset
        limit: Number(pageSize) // Pagination limit
    });

    const totalcount = await JobApplication.count({ 
		distinct: true, // Ensures distinct job IDs are counted
        col: 'id', 
        include: [
            {
                model: Jobs,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['job_title'] // Fetch the job_title                
            }            
        ],
        where: whereCondition, // Your conditions for filtering Jobs
        
    }); 

	const jobapplicationall = await JobApplication.findAll({ 
		include: [
            {
                model: Jobs,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['job_title'] // Fetch the job_title                
            }            
        ],
        order: [['id', 'DESC']]   
        
    }); 	
   

    res.status(200).json({ total_records: totalcount, data: jobapplications, total_data: jobapplicationall });

});

// POST route for creating a new job application
jobApplicationsRouter.post("/create", async (req, res) => {
	initializeJobApplicationModel(getSequelize()); // Initialize the model with the Sequelize instance
	initializeSkillModel(getSequelize()); 
	try {
		// Destructure fields from the request body
		const {
			full_name,
			email_address,
			mobile_number,
			current_company,
			designation,
			total_years_of_experience,
			relevant_skills,
			resume,
			note,
			apply_type,
			job_id,
			user_id,
		} = req.body;

		const institute_id = (req as any).instituteId;
		// Validate the necessary fields are provided
		if (
			!full_name ||
			!email_address ||
			!mobile_number ||
			!current_company ||
			!designation ||
			!total_years_of_experience ||
			!relevant_skills ||
			!resume ||
			!job_id ||
			!user_id
		) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		const skillNames: string[] = [];

		for (const skill of relevant_skills) {
			
			
			let skillRecord = await Professionalskills.findOne({
				where: { skill_name: skill },
			});

			if (!skillRecord) {
				// If the skill is custom, create a new skill entry
				skillRecord = await Professionalskills.create({
					skill_name: skill,
					institute_id: institute_id,
					status: 'active',
				});
			}

			// Add the skill name to the list of relevant skills
			skillNames.push(skillRecord.skill_name); // Save the skill name
		}
		console.log('skillNames',skillNames);
		// Create the job application in the database
		const jobApplication = await JobApplication.create({
			institute_id,
			full_name,
			email_address,
			mobile_number,
			current_company,
			designation,
			total_years_of_experience,
			relevant_skills: skillNames.join(","),
			resume,
			job_id,
			user_id,
			note,
			apply_type,
		});

		// Return success message with the created data
		res.json({
			message: "Job Application Created",
			data: jobApplication,
		});
	} catch (error) {
		// Handle errors and send a response with the error message
		console.error("Error creating job application:", error);
		res.status(500).json({
			message: "Failed to create job application",
			error: error,
		});
	}
});

jobApplicationsRouter.post("/updatestatus", auth, async (req, res) => {
	initializeJobApplicationModel(getSequelize());
	initializeEmailTemplateModel(getSequelize());
	initializeInstitutesModel(getSequelize());
	initializeUserModel(getSequelize());
	initializeJobModel(getSequelize());
	try {

		const emailtemplate = await EmailTemplates.findOne({
			order: [["id", "DESC"]],
			offset: 0, // Set the offset
			limit: 1, // Set the limit to the page size
		});

		const { id, recruiter_name, recruiter_comment, status } = req.body;

		const instituteId = (req as any).instituteId;	

		const jobapplication = await JobApplication.findOne({ where: { id: id } });
		
		const institutedata = await Institutes.findOne({ where: { id: instituteId } });

		const jobapplicationupdate = await JobApplication.update(
			{
				recruiter_name, recruiter_comment, status
			},
			{
				where: { id: id },
			},
		);

		const job = await Jobs.findOne({ where: { id: jobapplication?.job_id } });

		const user = await Users.findOne({ where: { id: jobapplication?.user_id } });


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

		
		subject =job?.job_title+" from "+institutedata?.institute_name;

		try {

			const dynamicValues = {
				"[User Name]": user?.first_name+" "+user?.last_name,
				"[Recruiter Name]": recruiter_name,		
				"[Status]": status,		
				"[Comment]": recruiter_comment,	
				"[Job Title]": job?.job_title,						
				"[Your Company Name]": institutedata?.institute_name,
				"[Year]": new Date().getFullYear(),
			};

			const emailTemplate = emailtemplate?.update_job_status as any;
			const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
					   .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
					   .replace(/\[Recruiter Name\]/g, dynamicValues["[Recruiter Name]"])
					   .replace(/\[Status\]/g, dynamicValues["[Status]"])
					   .replace(/\[Comment\]/g, dynamicValues["[Comment]"])
					   .replace(/\[Job Title\]/g, dynamicValues["[Job Title]"])
					   .replace(/\[Year\]/g, dynamicValues["[Year]"]);
			
			await transporter.sendMail({
				from: process.env.EMAIL_USER,
				to: user?.email,
				subject: subject,
				html: finalHtml,
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				  },
			});
		} catch (err) {
			console.error(`Failed to send email to ${user?.email}:`, err);
		}
	


		res.json({ message: "Status Updated Successfully", data: jobapplication });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});


export default jobApplicationsRouter;
