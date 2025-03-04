import express from 'express';
import Events, { initializeEventModel } from '../models/Event';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { Op, WhereOptions, Sequelize } from 'sequelize';
import multer from 'multer';
import fs from 'fs';
import Users, { initializeUserModel } from "../models/User";
import Institutes , { initializeInstitutesModel } from '../models/Institute';
import EmailTemplates , { initializeEmailTemplateModel } from '../models/EmailTemplate';
import Notification, { initializeNotificationModel } from '../models/Notification';
import UserGroup, { initializeUGroupModel } from '../models/UserGroup';
import nodemailer from "nodemailer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const directory = 'event';

        const dir = 'dist/uploads/' + directory;
    },
    filename: function (req, file, cb) {
        const file_ext = file.originalname.split('.').pop();
        // var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
        // var file_name = crypto.createHash('md5').update(random_string).digest('hex');
        // var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
        const file_name = Date.now()+'_'+file.originalname.replace("." + file_ext, "").replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, '_');
        cb(null, file_name + '.' + file_ext) //Appending extension
    }
});

const upload = multer({
    storage: storage
    
    
});

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const eventRouter = express.Router();

eventRouter.get('/', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;
    /*Events.hasMany(Users, {foreignKey: 'id'});
    Users.belongsTo(Events, {foreignKey: 'id', targetKey: 'user_id'});
    const role = await Events.findOne({ 
        include: [{
            model: Users,
            required: true,
            attributes: ['first_name'],
            separate: true,
          }
      ],
         });*/
    
    let whereCondition: WhereOptions<any> = {};
    let pageNumber;
    let pageSize;
    let offset;
   
    if (institute_id>0) {
       
        
        whereCondition.institute_id = institute_id as string;
       
    }

    if (req.query.hasOwnProperty('group_id')) {
        const group_id = Number(req.query.group_id);

        if (group_id > 0) {
            whereCondition.group_id = Sequelize.literal(`JSON_CONTAINS(group_id, '[${group_id}]')`);
        }     
        
        
    }

    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);

    if (filteruserid > 0) {
        const filteruserid = req.query.user_id;
        whereCondition.user_id = filteruserid;             
        }
    }
   

    if (req.query.hasOwnProperty('filter_category')) {
        if(req.query.filter_category!=''){
        const filterCategoryArray = (req.query.filter_category as string).split(',');
        if (filterCategoryArray.length > 0) {
        whereCondition.event_category = { [Op.in]: filterCategoryArray };
        }
        }
    }

    if (req.query.hasOwnProperty('filter_status')) {
        const filterstatus = req.query.filter_status;

    if (filterstatus != "") {       
        whereCondition.status = filterstatus;             
        }
    }
   
    if(req.query.hasOwnProperty('filter_date')){
        if(req.query.filter_date!=''){
            const filterDate = req.query.filter_date as string;

            const currentDate = new Date();

            // Get the start and end of the current day (for 'Present' condition)
            const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
            const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

            if(filterDate=='Future'){               
                if (!isNaN(currentDate.getTime())) {
                whereCondition.event_date = { [Op.gt]: currentDate };
                }
            } else if (filterDate === 'Past') {
                if (!isNaN(startOfToday.getTime())) {
                whereCondition.event_date = { [Op.lt]: startOfToday };
                }
        } 
        else if (filterDate === 'Present') {
            // Filter present events (event_date is today)
            if (!isNaN(startOfToday.getTime()) && !isNaN(endOfToday.getTime())) {
            whereCondition.event_date = { [Op.gte]: startOfToday, // Greater than or equal to the start of today
            [Op.lte]: endOfToday    // Less than or equal to the end of today };
            }
        };
            
            }
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

    
    const event = await Events.findAll({
         
    where: whereCondition,
    order: [['id', 'DESC']],
    offset: offset, // Set the offset
    limit: Number(pageSize) // Set the limit to the page size
      });
      

    const totalcount = await Events.count({        
      where: whereCondition
    });

    res.status(200).json({ total_records: totalcount, data: event });

});


eventRouter.get('/:id', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    console.log("req.params.id", req.params.id);
       const event = await Events.findOne({ 
        
        where: { id: req.params.id } });
   


if (!event) {
    res.status(500).json({ message: "Invalid Event" });
    return;
} else{
    const eventdate = new Date(event.event_date);
    const formattedDate = eventdate.toISOString().split('T')[0];
    const formattedEventDetail = {
        id: event.id,
        event_title: event.event_title,
        event_date: formattedDate,
        event_time: event.event_time,
        createdAt: event.created_on,
        event_type: event.event_type,
        event_category: event.event_category,
        location: event.location,
        description: event.description,
        event_image: event.event_image,
        user_id: event.user_id,
        group_id: event.group_id,
        join_members: event.join_members,
        maybe_members: event.maybe_members,
        decline_members: event.decline_members,
        updatedAt: event.updated_on
        
    };


 
const eventDetails = JSON.parse(JSON.stringify(formattedEventDetail));
res.json({ message: "Event Details", data: eventDetails });
}


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

eventRouter.delete('/:id', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const event = await Events.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!event) {
        res.status(500).json({ message: "Invalid Event" });
        return;
    }

    try {
     await Events.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Event Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Event" });
            return;
      }

});

eventRouter.post("/status", auth, async (req, res) => {
    initializeEventModel(getSequelize());
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

		const event = await Events.findOne({ where: { id: id } });

		
		const institutedata = await Institutes.findOne({ where: { id: instituteId } });

		console.log("institutedata",institutedata);

		if (!event) {
			res.status(500).json({ message: "Invalid Event" });
			return;
		}

		const eventnew = await Events.update(
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

        const user = await Users.findOne({ where: { id: event.user_id } });

		// Use Promise.all() to send emails in parallel
		let subject;

		if(status=='active'){
			subject = "Your Event has been activated";
		}
		else{
			subject = "Your Event has been deactivated";
		}

			if (event) {
				try {

					const dynamicValues = {
						"[User Name]": user?.first_name+" "+user?.last_name,
						"[subject]": subject,
                        "[Event Id]": event.id,
                        "[Event Title]": event.event_title,
                        "[Status]": event.status,							
						"[Your Company Name]": institutedata?.institute_name,
						"[Year]": new Date().getFullYear(),
					};

					const emailTemplate = emailtemplate?.event_confirm_mail as any;
					const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
                               .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
							   .replace(/\[subject\]/g, dynamicValues["[subject]"])
                               .replace(/\[Event Id\]/g, dynamicValues["[Event Id]"])
                               .replace(/\[Event Title\]/g, dynamicValues["[Event Title]"])
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

		res.json({ message: "Status Updated Successfully", data: event });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}	
});

eventRouter.post('/create', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    initializeUserModel(getSequelize());
	initializeEmailTemplateModel(getSequelize());
    initializeInstitutesModel(getSequelize());	
    initializeNotificationModel(getSequelize());	
    initializeUGroupModel(getSequelize());
       
    try {
        const {
            id,
            event_title,
            event_date,
            event_type,
            event_category,
            event_image,
            location,
            description,            
            user_id,
            group_id,
            status                   
        } = req.body;

        const institute_id = (req as any).instituteId;
        console.log("req.body", req.body);

        const institutedata = await Institutes.findOne({ where: { id: institute_id } });

        const user = await Users.findOne({ where: { id: user_id } });

        let event: Events | null;
        
        
        if (id) {
            const event = await Events.update(
                {
                    institute_id,
                    event_title,
                    event_date,
                    event_type,
                    event_category,
                    location,
                    description,
                    event_image,
                    user_id,
                    group_id,
                    status                
                },
                {
                    where: { id: id }
                }
            );

            

            

            res.json({ message: "Event Updated", data: event });
        } else {
                       
           
            let modifiedStatus = 'inactive';

                    const event = await Events.create({
                        institute_id,
                        event_title,
                        event_date,
                        event_type,
                        event_category,
                        location,
                        description,
                        event_image,
                        user_id,
                        status: modifiedStatus || 'inactive',
                        join_members: '',
                        maybe_members: '',
                        decline_members: '',
                        group_id                        
                    });

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
                
                    const messagedesc = user?.first_name+" added new Event Id#"+event.id;

                    const notifyurl = "events/"+event.id;
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

					subjectAdmin = "New Event Added";
			
						
							try {
			
								const dynamicValues = {
									"[User Name]": user?.first_name+" "+user?.last_name,											
									"[Your Company Name]": institutedata?.institute_name,
									"[Year]": new Date().getFullYear(),
									"[Event Title]": event_title,
									"[Category]": event_category,
									"[Location]": location,
									"[Event Id]": event.id,
                                    "[Event Date]": event_date,                                  
								};
			
								
								const emailAdminTemplate = emailtemplate?.new_event_mail as any;
								const finalAdminHtml = emailAdminTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
													  .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
													  .replace(/\[Event Title\]/g, dynamicValues["[Event Title]"])
													  .replace(/\[Category\]/g, dynamicValues["[Category]"])	
													  .replace(/\[Location\]/g, dynamicValues["[Location]"])	
													  .replace(/\[Event Id\]/g, dynamicValues["[Event Id]"])
                                                      .replace(/\[Event Date\]/g, dynamicValues["[Event Date]"])											  
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
                    
                    res.json({ message: "Event Created", data: event });
                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});

eventRouter.post("/updatejoinmaybeUser", auth, async (req, res) => {
	initializeEventModel(getSequelize());
	try {
		const {
			id,
			join_members,
			maybe_members,
			decline_members,			
		} = req.body;

		const event = await Events.update(
			{
				join_members,
			    maybe_members,
			    decline_members,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "User Updated", data: event });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});




export default eventRouter;
