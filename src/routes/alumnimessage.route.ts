import express from 'express';
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
import AlumniMessage, { initializeMessageModel } from '../models/AlumniMessage';
import nodemailer from "nodemailer";




const alumnimessageRouter = express.Router();



alumnimessageRouter.get('/', auth, async (req, res) => {
    initializeMessageModel(getSequelize());
    initializeUserModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;
   
    Users.hasMany(AlumniMessage, {foreignKey: 'sender_id'});
    AlumniMessage.belongsTo(Users, {foreignKey: 'sender_id', targetKey: 'id'});
    
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
        whereCondition.receiver_id = filteruserid;             
        }
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

    
    const alumnimessage = await AlumniMessage.findAll({    
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name','last_name'] // Fetch the skill_name                
            }
        ],     
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
      

    const totalcount = await AlumniMessage.count({  
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned                             
            }
        ],      
      where: whereCondition
    });

    res.status(200).json({ total_records: totalcount, data: alumnimessage });

});

alumnimessageRouter.get('/unreadcount', auth, async (req, res) => {
    initializeMessageModel(getSequelize());
    initializeUserModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;
   
    Users.hasMany(AlumniMessage, {foreignKey: 'sender_id'});
    AlumniMessage.belongsTo(Users, {foreignKey: 'sender_id', targetKey: 'id'});
    
    let whereCondition: WhereOptions<any> = {};
    let pageNumber;
    let pageSize;
    let offset;
   
    if (institute_id>0) {
       
        
        whereCondition.institute_id = institute_id as string;
       
    }

    whereCondition.status = 'active';
    
    if (req.query.hasOwnProperty('user_id')) {
        const filteruserid = Number(req.query.user_id);

    if (filteruserid > 0) {
        const filteruserid = req.query.user_id;
        whereCondition.receiver_id = filteruserid;             
        }
    }
   


    
         

    const totalcount = await AlumniMessage.count({  
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned                             
            }
        ],      
      where: whereCondition
    });

    res.status(200).json({ total_records: totalcount });

});


alumnimessageRouter.get('/:id', auth, async (req, res) => {
    initializeMessageModel(getSequelize());
    initializeUserModel(getSequelize());
    console.log("req.params.id", req.params.id);
    Users.hasMany(AlumniMessage, {foreignKey: 'sender_id'});
    AlumniMessage.belongsTo(Users, {foreignKey: 'sender_id', targetKey: 'id'});
       const alumnimessage = await AlumniMessage.findOne({ 
        include: [
            {
                model: Users,
                required: true, // Ensures only Jobs with JobSkills are returned
                attributes: ['first_name','last_name'] // Fetch the skill_name                
            }
        ],    
        where: { id: req.params.id } });
   

        const alumnimessageDetails = JSON.parse(JSON.stringify(alumnimessage));
        
        if (!alumnimessage) {
            res.status(500).json({ message: "Invalid Message" });
            return;
        }
        res.json({ message: "Message Details", data: alumnimessageDetails });

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

alumnimessageRouter.delete('/:id', auth, async (req, res) => {
    initializeMessageModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const alumnimessage = await AlumniMessage.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!alumnimessage) {
        res.status(500).json({ message: "Invalid Message" });
        return;
    }

    try {
     await AlumniMessage.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Message Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Message" });
            return;
      }

});

alumnimessageRouter.post("/updatestatus", auth, async (req, res) => {
    initializeMessageModel(getSequelize());
	
	console.log("req.params.id", req.params.id);
	

	
	try {
		const { id, status } = req.body;

		

		const alumnimessage = await AlumniMessage.findOne({ where: { id: id } });

		
		
		if (!alumnimessage) {
			res.status(500).json({ message: "Invalid Message" });
			return;
		}

		const alumnimessagenew = await AlumniMessage.update(
			{
				status,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "Status Updated Successfully", data: alumnimessage });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}	
});




export default alumnimessageRouter;
