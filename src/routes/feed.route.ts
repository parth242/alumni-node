import express from 'express';
import Feeds, { initializeFeedModel } from '../models/Feed';
import { getSequelize } from '../config/db';
import Users, { initializeUserModel } from '../models/User';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { Op,WhereOptions,Sequelize } from 'sequelize';
import Categorys, { initializeCategoryModel } from '../models/Category';
import FeedComments, { initializeFeedCommentModel } from '../models/FeedComment';
import FeedReport, { initializeFeedReportModel } from '../models/FeedReport';
import EmailTemplates , { initializeEmailTemplateModel } from '../models/EmailTemplate';
import Institutes , { initializeInstitutesModel } from '../models/Institute';
import Notification, { initializeNotificationModel } from '../models/Notification';
import UserGroup, { initializeUGroupModel } from '../models/UserGroup';
import nodemailer from "nodemailer";
import Groups, { initializeGroupModel } from '../models/Group';

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const feedRouter = express.Router();

feedRouter.get('/feedcomments', auth, async (req, res) => {
    initializeFeedCommentModel(getSequelize());
    
    Users.hasMany(FeedComments, {foreignKey: 'user_id'});
    FeedComments.belongsTo(Users, {foreignKey: 'user_id', targetKey: 'id'});

    
    const institute_id = (req as any).instituteId;
   

    let whereCondition: WhereOptions<any> = {};
    let pageNumber;
    let pageSize;
    let offset;

  
    if (req.query.hasOwnProperty('feed_id')) {
        const feed_id = Number(req.query.feed_id);

        if (feed_id > 0) {
            whereCondition.feed_id = feed_id;
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

    
    const feedcomment = await FeedComments.findAll({
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name','last_name','image'] // Fetch the skill_name                
            }
        ],
    where: whereCondition,
    order: [['id', 'DESC']],
    offset: offset, // Set the offset
    limit: Number(pageSize) // Set the limit to the page size
      });
      
    const totalcount = await FeedComments.count({   
        include: [
            {
                model: Users,
                required: true // Ensures only Jobs with JobSkills are returned                          
            }
        ],     
      where: whereCondition
    });

    

    res.status(200).json({ total_records: totalcount, data: feedcomment});

});

feedRouter.get('/', auth, async (req, res) => {
    initializeFeedModel(getSequelize());
    initializeUserModel(getSequelize());
    initializeCategoryModel(getSequelize());
    initializeGroupModel(getSequelize());
    initializeFeedCommentModel(getSequelize());
    
   
    FeedComments.belongsTo(Users, {foreignKey: 'user_id', targetKey: 'id'});
    console.log("req", req.body);
    Users.hasMany(Feeds, {foreignKey: 'user_id'});
    Feeds.belongsTo(Users, {foreignKey: 'user_id', targetKey: 'id'});

    Categorys.hasMany(Feeds, {foreignKey: 'category_id'});
    Feeds.belongsTo(Categorys, {foreignKey: 'category_id', targetKey: 'id'});

    Groups.hasMany(Feeds, {foreignKey: 'group_id'});
    Feeds.belongsTo(Groups, {foreignKey: 'group_id', targetKey: 'id'});

    Feeds.hasMany(FeedComments, {foreignKey: 'feed_id'});
    FeedComments.belongsTo(Feeds, {foreignKey: 'feed_id', targetKey: 'id'});

    const institute_id = (req as any).instituteId;
    

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
            whereCondition.group_id = group_id;
        }     
        
        
    }

    if (req.query.hasOwnProperty('user_id')) {
        const user_id = Number(req.query.user_id);

        if (user_id > 0) {
            whereCondition.user_id = user_id;
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

    
    const feed = await Feeds.findAll({
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name','last_name','image'] // Fetch the skill_name                
            },
            {
                model: Categorys,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['category_name'] // Fetch the skill_name                
            },
            {
                model: Groups,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['group_name'] // Fetch the skill_name                
            },
            {
                model: FeedComments,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['id'] // Fetch the skill_name                
            }
        ],
    where: whereCondition,
    order: [['id', 'DESC']],
    offset: offset, // Set the offset
    limit: Number(pageSize) // Set the limit to the page size
      });
      
    const totalcount = await Feeds.count({  
        distinct: true, // Ensures distinct job IDs are counted
        col: 'id',  
        include: [
            {
                model: Users,
                required: true // Ensures only Jobs with JobSkills are returned                          
            },
            {
                model: Categorys,
                required: false, // Ensures only Jobs with JobSkills are returned                            
            },
            {
                model: Groups,
                required: false, // Ensures only Jobs with JobSkills are returned                             
            },
            {
                model: FeedComments,
                required: false, // Ensures only Jobs with JobSkills are returned                          
            }
        ],     
      where: whereCondition
    });

    

    res.status(200).json({ total_records: totalcount, data: feed});

});


feedRouter.get('/:id', auth, async (req, res) => {
    initializeFeedModel(getSequelize());
    initializeUserModel(getSequelize());
    initializeCategoryModel(getSequelize());
    
    console.log("req.params.id", req.params.id);
    
    Users.hasMany(Feeds, {foreignKey: 'user_id'});
    Feeds.belongsTo(Users, {foreignKey: 'user_id', targetKey: 'id'});

    Categorys.hasMany(Feeds, {foreignKey: 'category_id'});
    Feeds.belongsTo(Categorys, {foreignKey: 'category_id', targetKey: 'id'});

    const feed = await Feeds.findOne({
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name','last_name','image'] // Fetch the skill_name                
            },
            {
                model: Categorys,
                required: false, // Ensures only Jobs with JobSkills are returned
                attributes: ['category_name'] // Fetch the skill_name                
            }
        ],
    where: { id: req.params.id } });


if (!feed) {
    res.status(500).json({ message: "Invalid Feeds" });
    return;
}
const feedDetails = JSON.parse(JSON.stringify(feed));
res.json({ message: "Feeds Details", data: feedDetails });

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

feedRouter.delete('/:id', auth, async (req, res) => {
    initializeFeedModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const feed = await Feeds.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!feed) {
        res.status(500).json({ message: "Invalid Feeds" });
        return;
    }

    try {
     await Feeds.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Feeds Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Feeds" });
            return;
      }

});

feedRouter.post('/create', async (req, res) => {
    initializeFeedModel(getSequelize());
    initializeUserModel(getSequelize());
    initializeNotificationModel(getSequelize());	
    initializeUGroupModel(getSequelize());
    try {
        const {
            id,           
            description,
            feed_image,
            status,
            user_id,
            group_id,
            category_id                  
        } = req.body;
        const institute_id = (req as any).instituteId;
        console.log("req.body", req.body);

        let feed: Feeds | null;
        
        
        if (id) {
            const feed = await Feeds.update(
                {
                    institute_id,
                    description,  
                    feed_image,                
                    status,
                    user_id,
                    group_id,
                    category_id                  
                },
                {
                    where: { id: id }
                }
            );

            

            

            res.json({ message: "Feeds Updated", data: feed });
        } else {
                               

                    const feed = await Feeds.create({  
                        institute_id,                                     
                        description,   
                        feed_image,                  
                        status,
                        user_id,
                        group_id,
                        category_id
                    });

                    const user = await Users.findOne({ where: { id: user_id } });

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
                
                    const messagedesc = user?.first_name+" posted on dashboard Id#"+feed.id;

                    const notifyurl = "view-feedback/"+feed.id;
                    const notifydata = userIds.map(userid =>{
                        return { sender_id: user_id, receiver_id: userid.dataValues.user_id, message_desc: messagedesc, notify_url: notifyurl};                        
                    } );

                            
                    const notificationdata = await Notification.bulkCreate(notifydata);
                    
                    res.json({ message: "Feed Created", data: feed });
                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});



feedRouter.post('/createcomment', async (req, res) => {
    initializeFeedCommentModel(getSequelize());
    try {
        const {
            id,           
            comment_desc,
            status,
            user_id,
            feed_id                         
        } = req.body;
       

        let feedcomment: FeedComments | null;
                                     

        const feed = await FeedComments.create({  
                    comment_desc,
                    status,
                    user_id,
                    feed_id 
                });
                    
        res.json({ message: "Feed Comment Created", data: feed });
                
       
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});

feedRouter.post('/createreport', async (req, res) => {
    initializeFeedReportModel(getSequelize());
    try {
        const {
            id,           
            report_reason,           
            user_id,
            feed_id                         
        } = req.body;
       

        let feedreport: FeedReport | null;
                                     

        const feed = await FeedReport.create({  
                    report_reason,                 
                    user_id,
                    feed_id 
                });
                    
        res.json({ message: "Feed Report Submitted", data: feed });
                
       
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});

feedRouter.post("/status", auth, async (req, res) => {
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

		const feed = await Feeds.findOne({ where: { id: id } });

		
		const institutedata = await Institutes.findOne({ where: { id: instituteId } });

		console.log("institutedata",institutedata);

		if (!feed) {
			res.status(500).json({ message: "Invalid Post" });
			return;
		}

		const usernew = await Feeds.update(
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
			subject = "Your Post has been activated";
		}
		else if(status=='rejected'){
			subject = "Your Post has been rejected";
		} else{
			subject = "Your Post has been deactivated";
		}

			if (feed) {
                const user = await Users.findOne({ where: { id: feed.user_id } });

                    if(user){
				try {

                    
					const dynamicValues = {
						"[User Name]": user.first_name+" "+user.last_name,
                        "[Post Date]": feed.created_on,
						"[status]": status,						
						"[Your Company Name]": institutedata?.institute_name,
						"[Year]": new Date().getFullYear(),
					};

					const emailTemplate = emailtemplate?.update_post_status as any;
					const finalHtml = emailTemplate.replace(/\[User Name\]/g, dynamicValues["[User Name]"])                              
                               .replace(/\[Your Company Name\]/g, dynamicValues["[Your Company Name]"])
							   .replace(/\[status\]/g, dynamicValues["[status]"])
                               .replace(/\[Post Date\]/g, dynamicValues["[Post Date]"])
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
			} 		

		res.json({ message: "Status Updated Successfully", data: feed });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}	
});

export default feedRouter;
