import express from 'express';
import Jobs, { initializeJobModel } from '../models/Job';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { Op,WhereOptions,Sequelize } from 'sequelize';
import Users, { initializeUserModel } from "../models/User";
import JobSkill, { initializeJobSkillModel } from '../models/JobSkill';
import JobArea, { initializeJobAreaModel } from '../models/JobArea';
import Notification, { initializeNotificationModel } from '../models/Notification';
import Institutes , { initializeInstitutesModel } from '../models/Institute';
import EmailTemplates , { initializeEmailTemplateModel } from '../models/EmailTemplate';
import UserGroup, { initializeUGroupModel } from '../models/UserGroup';
import nodemailer from "nodemailer";

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const jobRouter = express.Router();

jobRouter.get('/', auth, async (req, res) => {
    initializeJobModel(getSequelize());
    initializeJobSkillModel(getSequelize());
    initializeJobAreaModel(getSequelize());
        Jobs.hasMany(JobSkill, {foreignKey: 'job_id'});
        JobSkill.belongsTo(Jobs, {foreignKey: 'job_id', targetKey: 'id'});

        Jobs.hasMany(JobArea, {foreignKey: 'job_id'});
        JobArea.belongsTo(Jobs, {foreignKey: 'job_id', targetKey: 'id'});

        const institute_id = (req as any).instituteId;
         
        interface FilterWhere {
            user_id: number;           
        }

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

    if (req.query.hasOwnProperty('is_internship')) {           
        
        whereCondition.is_internship = req.query.is_internship;          
        
    }

    if (req.query.hasOwnProperty('filter_status')) {
        const filterstatus = req.query.filter_status;

    if (filterstatus != "") {       
        whereCondition.status = filterstatus;             
        }
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

   
    const jobs = await Jobs.findAll({ 
        include: [
            {
                model: JobSkill,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
        where: whereCondition, // Your conditions for filtering Jobs
        order: [['id', 'DESC']],
        offset: offset, // Pagination offset
        limit: Number(pageSize) // Pagination limit
    });

    // Map through the results to format them as desired
    const formattedJobs = jobs.map(job => {
        // Define the type for the skill object
        const jobSkills: string[] = job.dataValues.job_skills.map((skill: any) => skill.dataValues.skill_name); // Extract skill names

        const jobAreas: string[] = job.dataValues.job_areas.map((area: any) => area.dataValues.area_name); // Extract skill names
        
        return {
            id: job.id,
            job_title: job.job_title,
            is_internship: job.is_internship,
            company: job.company,
            company_website: job.company_website,
            createdAt: job.created_on,
            deadline_date: job.deadline_date,
            job_description: job.job_description,
            job_type: job.job_type,
            location: job.location,
            duration: job.duration,
            experience_from: job.experience_from,
            experience_to: job.experience_to,
            posted_date: job.posted_date,
            updatedAt: job.updated_on,
            user_id: job.user_id,
            status: job.status,
            skill_name: jobSkills, // Include the skills as an array
            area_name: jobAreas // Include the skills as an array
        };
    });
      
    const totalcount = await Jobs.count({  
        distinct: true, // Ensures distinct job IDs are counted
        col: 'id',     
        include: [
            {
                model: JobSkill,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
    where: whereCondition    
    });

    const jobsall = await Jobs.findAll({ 
        include: [
            {
                model: JobSkill,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
        order: [['id', 'DESC']]      
    });

    // Map through the results to format them as desired
    const formattedJobsall = jobsall.map(job => {
        // Define the type for the skill object
        const jobSkillsall: string[] = job.dataValues.job_skills.map((skill: any) => skill.dataValues.skill_name); // Extract skill names

        const jobAreasall: string[] = job.dataValues.job_areas.map((area: any) => area.dataValues.area_name); // Extract skill names
        
        return {
            id: job.id,
            job_title: job.job_title,
            is_internship: job.is_internship,
            company: job.company,
            company_website: job.company_website,
            createdAt: job.created_on,
            deadline_date: job.deadline_date,
            job_description: job.job_description,
            job_type: job.job_type,
            location: job.location,
            duration: job.duration,
            experience_from: job.experience_from,
            experience_to: job.experience_to,
            posted_date: job.posted_date,
            updatedAt: job.updated_on,
            user_id: job.user_id,
            status: job.status,
            skill_name: jobSkillsall, // Include the skills as an array
            area_name: jobAreasall // Include the skills as an array
        };
    });

    res.status(200).json({ total_records: totalcount, data: formattedJobs, total_data: formattedJobsall });

});


jobRouter.get('/:id', auth, async (req, res) => {
    initializeJobModel(getSequelize());
    initializeJobSkillModel(getSequelize());
    initializeJobAreaModel(getSequelize());
    console.log("req.params.id", req.params.id);

    Jobs.hasMany(JobSkill, {foreignKey: 'job_id'});
        JobSkill.belongsTo(Jobs, {foreignKey: 'job_id', targetKey: 'id'});

        Jobs.hasMany(JobArea, {foreignKey: 'job_id'});
        JobArea.belongsTo(Jobs, {foreignKey: 'job_id', targetKey: 'id'});

        

       const job = await Jobs.findOne({ 

        include: [
            {
                model: JobSkill,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['skill_name'] // Fetch the skill_name                
            },
            {
                model: JobArea,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['area_name'] // Fetch the skill_name                
            },
        ],
               
        where: { id: req.params.id } 
    });

    if (!job) {
        res.status(500).json({ message: "Invalid Job" });
        return;
    } else{
        // Define the type for the skill object
        const jobSkillsall: string[] = job?.dataValues.job_skills.map((skill: any) => skill.dataValues.skill_name); // Extract skill names

        const jobAreasall: string[] = job?.dataValues.job_areas.map((area: any) => area.dataValues.area_name); // Extract skill names
        
        const formattedJobDetail = {
            id: job.id,
            job_title: job.job_title,
            is_internship: job.is_internship,
            company: job.company,
            createdAt: job.created_on,
            deadline_date: job.deadline_date,
            job_description: job.job_description,
            job_type: job.job_type,
            location: job.location,
            contact_email: job.contact_email,
            company_website: job.company_website,
            experience_from: job.experience_from,
            experience_to: job.experience_to,
            duration: job.duration,
            salary_package: job.salary_package,
            posted_date: job.posted_date,
            updatedAt: job.updated_on,
            user_id: job.user_id,
            status: job.status,
            skill_name: jobSkillsall, // Include the skills as an array
            area_name: jobAreasall // Include the skills as an array
        };
    
   
        
const jobDetails = JSON.parse(JSON.stringify(formattedJobDetail));
res.json({ message: "Job Details", data: jobDetails });
    }



});



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

jobRouter.delete('/:id', auth, async (req, res) => {
    initializeJobModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const event = await Jobs.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!event) {
        res.status(500).json({ message: "Invalid Job" });
        return;
    }

    try {
     await Jobs.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Job Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Job" });
            return;
      }

});

jobRouter.post("/status", auth, async (req, res) => {
    initializeJobModel(getSequelize());
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

		const job = await Jobs.findOne({ where: { id: id } });

		
		const institutedata = await Institutes.findOne({ where: { id: instituteId } });

		console.log("institutedata",institutedata);

		if (!job) {
			res.status(500).json({ message: "Invalid Job" });
			return;
		}

		const jobnew = await Jobs.update(
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

        const user = await Users.findOne({ where: { id: job.user_id } });

		// Use Promise.all() to send emails in parallel
		let subject;

		if(status=='active'){
			subject = "Your Job has been activated";
		}
		else{
			subject = "Your Job has been deactivated";
		}

			if (job) {
				try {

					const dynamicValues = {
						"[User Name]": user?.first_name+" "+user?.last_name,
						"[subject]": subject,
                        "[Job Id]": job.id,
                        "[Job Title]": job.job_title,
                        "[Status]": job.status,							
						"[Your Company Name]": institutedata?.institute_name,
						"[Year]": new Date().getFullYear(),
					};

					const emailTemplate = emailtemplate?.job_confirm_mail as any;
					const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
                               .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
							   .replace(/\[subject\]/g, dynamicValues["[subject]"])
                               .replace(/\[Job Id\]/g, dynamicValues["[Job Id]"])
                               .replace(/\[Job Title\]/g, dynamicValues["[Job Title]"])
                               .replace(/\[Status\]/g, dynamicValues["[Status]"])
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
			} 		

		res.json({ message: "Status Updated Successfully", data: job });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}	
});

jobRouter.post('/create', async (req, res) => {
    initializeJobModel(getSequelize());
    initializeJobSkillModel(getSequelize());
    initializeJobAreaModel(getSequelize());
    initializeUserModel(getSequelize());
	initializeEmailTemplateModel(getSequelize());
    initializeInstitutesModel(getSequelize());	
    initializeNotificationModel(getSequelize());	
    initializeUGroupModel(getSequelize());
    
    try {
        const {
            id,
            is_internship,
            job_title,
            company,
            location,
            contact_email,
            job_type,
            deadline_date,
            posted_date,
            company_website,
            experience_from,
            experience_to,
            duration,
            salary_package,
            job_description,
            area_name,
            skill_name,
            user_id,
            status                   
        } = req.body;
        const institute_id = (req as any).instituteId;
        console.log("req.body", req.body);

        

        const institutedata = await Institutes.findOne({ where: { id: institute_id } });

        const user = await Users.findOne({ where: { id: user_id } });

        let job: Jobs | null;
        
        
        if (id) {
            const job = await Jobs.update(
                {
                    institute_id,
                    is_internship,
                    job_title,
                    company,
                    location,
                    contact_email,
                    job_type,
                    deadline_date,
                    posted_date,
                    company_website,
                    experience_from,
                    experience_to,
                    duration,
                    salary_package,
                    job_description,
                    user_id,
                    status                
                },
                {
                    where: { id: id }
                }
            );
            
            await JobArea.destroy({
                where: {
                    job_id: id 
                }
              });

            const areaName = area_name.map((mn:string) => {
                return { job_id: id, area_name: mn };
            });             
                
            const jobareaname = await JobArea.bulkCreate(areaName);

            await JobSkill.destroy({
                where: {
                    job_id: id 
                }
              });

            const skillNames = skill_name.map((mn:string) => {
                return { job_id: id, skill_name: mn };
            }); 

            const jobskillname = await JobSkill.bulkCreate(skillNames);

            res.json({ message: "Job Updated", data: job });
        } else {
                               

                    const job = await Jobs.create({
                        institute_id,
                        is_internship,
                        job_title,
                        company,
                        location,
                        contact_email,
                        job_type,
                        deadline_date,
                        posted_date,
                        company_website,
                        experience_from,
                        experience_to,
                        duration,
                        salary_package,
                        job_description,
                        user_id,
                        status
                    });
                    
                    const areaName = area_name.map((mn:string) => {
                        return { job_id: job.id, area_name: mn };
                    });             
                        
                    const jobareaname = await JobArea.bulkCreate(areaName);
        
                    const skillNames = skill_name.map((mn:string) => {
                        return { job_id: job.id, skill_name: mn };
                    }); 
        
                    const jobskillname = await JobSkill.bulkCreate(skillNames);
                   
                    const usergroupnew = await UserGroup.findAll({
                        where: {'user_id':user_id},
                        attributes: ['group_id'],
                        order: [['id', 'ASC']]                    
                    });
                
                    const groupids = usergroupnew.map(groupid =>{
                        return groupid.dataValues.group_id
                    } );
                
                    const userIds = await UserGroup.findAll({
                        where: {
                            group_id: {
                                [Op.in]: groupids
                            },
                            user_id: {
                                [Op.ne]: user_id  // Exclude user_id
                            }
                        },
                        attributes: ['user_id'],
                        order: [['id', 'ASC']]                    
                    });
                
                    const messagedesc = user?.first_name+" added new Job Id#"+job.id;

                    const notifyurl = "job-details/"+job.id;
                    const notifydata = userIds.map(userid =>{
                        return { sender_id: user_id, receiver_id: userid.dataValues.user_id, message_desc: messagedesc, notify_url: notifyurl};                        
                    } );

                            
                    const notificationdata = await Notification.bulkCreate(notifydata);

                    const emailtemplate = await EmailTemplates.findOne({
                        order: [["id", "DESC"]],
                        offset: 0, // Set the offset
                        limit: 1, // Set the limit to the page size
                    });

                    const adminuser = await Users.findOne({ where: { is_admin: 1, status: "active", institute_id: institute_id } });

                    const transporter = nodemailer.createTransport({
						service: "gmail",
						auth: {
							user: process.env.EMAIL_USER,
							pass: process.env.EMAIL_PASS,
						},
					});
			
					const notFoundEmails: string[] = [];
			
					// Use Promise.all() to send emails in parallel
					
					let subjectAdmin;

					subjectAdmin = "New Job Added";
			
						
							try {
			
								const dynamicValues = {
									"[User Name]": user?.first_name+" "+user?.last_name,											
									"[Your Company Name]": institutedata?.institute_name,
									"[Year]": new Date().getFullYear(),
									"[Job Title]": job_title,
									"[Company]": company,
									"[Location]": location,
									"[Job Id]": job.id,
                                    "[Contact Email]": contact_email,
								};
			
								
								const emailAdminTemplate = emailtemplate?.new_job_mail as any;
								const finalAdminHtml = emailAdminTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
													  .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
													  .replace(/\[Job Title\]/g, dynamicValues["[Job Title]"])
													  .replace(/\[Company\]/g, dynamicValues["[Company]"])	
													  .replace(/\[Location\]/g, dynamicValues["[Location]"])	
													  .replace(/\[Job Id\]/g, dynamicValues["[Job Id]"])
                                                      .replace(/\[Contact Email\]/g, dynamicValues["[Contact Email]"])											  
													  .replace(/\[Year\]/g, dynamicValues["[Year]"]);
								
								
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
								console.error(`Failed to send email to ${adminuser?.email}:`, err);
							}

                    res.json({ message: "Job Created", data: job });
                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


jobRouter.post("/send-email", async (req, res) => {
	initializeUserModel(getSequelize());
    initializeJobModel(getSequelize());
    initializeEmailTemplateModel(getSequelize());
    initializeInstitutesModel(getSequelize());

	const { recipients, subject, message, job_id, share_url, user_id } = req.body;

	if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
		return res.status(400).json({ message: "No recipients provided." });
	}

	try {
		// Configure Nodemailer transporter

        const institute_id = (req as any).instituteId;

		
		const institutedata = await Institutes.findOne({ where: { id: institute_id } });

        const emailtemplate = await EmailTemplates.findOne({
            order: [["id", "DESC"]],
            offset: 0, // Set the offset
            limit: 1, // Set the limit to the page size
        });

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const notFoundEmails: string[] = [];
        
        const logguser = await Users.findOne({
            where: { id: user_id, institute_id: institute_id },
        });

        const job = await Jobs.findOne({ where: { id: job_id} });

		// Use Promise.all() to send emails in parallel
		const sendPromises = recipients.map(async email => {
		const user = await Users.findOne({ where: { email } });

        
			if (user) {
				try {

                    const dynamicValues = {
                        "[User Name]": user.first_name+" "+user.last_name,											
                        "[Your Company Name]": institutedata?.institute_name,
                        "[Year]": new Date().getFullYear(),
                        "[Logged UserName]": logguser?.first_name+" "+logguser?.last_name,	                        
                        "[Job Title]": job?.job_title,
                        "[Job Url]": share_url, 
                        "[message]": message,                      
                    };

                    const emailTemplate = emailtemplate?.refer_job_friend as any;
                    const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
                               .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])	
                               .replace(/\[Logged UserName\]/g, dynamicValues["[Logged UserName]"])	
                               .replace(/\[Job Title\]/g, dynamicValues["[Job Title]"])	
                               .replace(/\[Job Url\]/g, dynamicValues["[Job Url]"])	
                               .replace(/\[message\]/g, dynamicValues["[message]"])										  
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
				} catch (err) {
					console.error(`Failed to send email to ${email}:`, err);
				}
			} else {
				notFoundEmails.push(email);
			}
		});

		// Wait for all email sending tasks to complete
		await Promise.all(sendPromises);

		// Response summarizing the result
		return res.status(200).json({
			message: "Emails processed.",
			notFoundEmails,
		});
	} catch (error) {
		console.error("Error in send-email route:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
});



export default jobRouter;
