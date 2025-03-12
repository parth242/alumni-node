import express from 'express';
import Notifications, { initializeNotificationModel } from '../models/Notification';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { getSequelize } from '../config/db';
import Users, { initializeUserModel } from '../models/User';
import UserIndustry, { initializeUIndustryModel } from '../models/UserIndustry';
import UserProfessionalskill, { initializeUSkillModel } from '../models/UserProfessionalskill';
import UserWorkRole, { initializeUWorkModel } from '../models/UserWorkRole';
import Industries, { initializeIndustryModel } from '../models/Industry';
import WorkRoles, { initializeWorkModel } from '../models/WorkRole';
import Professionalskills, { initializeSkillModel } from '../models/Professionalskill';

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const notificationRouter = express.Router();

notificationRouter.get('/', async (req, res) => {
    initializeNotificationModel(getSequelize());
    console.log("reqnotify", req.body);

    let filterwhere;

    filterwhere = {
        ...filterwhere,
        is_read: 0,
    };

    if (req.query.hasOwnProperty("user_id")) {
		filterwhere = {
			...filterwhere,
			receiver_id: req.query.user_id,
		};
	}

    const notification = await Notifications.findAll({where: filterwhere,order: [["id", "DESC"]],});
    res.status(200).json({ total_records: 10, data: notification });

});



notificationRouter.get('/:id', auth, async (req, res) => {
    initializeNotificationModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const notification = await Notifications.findOne({ where: { id: req.params.id } });
    console.log("notification", notification);
    const notificationDetails = JSON.parse(JSON.stringify(notification));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!notification) {
        res.status(500).json({ message: "Invalid Notification" });
        return;
    }
    res.json({ message: "Notification Details", data: notificationDetails });

});



notificationRouter.delete('/:id', auth, async (req, res) => {
    initializeNotificationModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const notification = await Notifications.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!notification) {
        res.status(500).json({ message: "Invalid Notification" });
        return;
    }

    try {
     await Notifications.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Notification Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Notification" });
            return;
      }

});



notificationRouter.post('/updatenotification', async (req, res) => {
    initializeNotificationModel(getSequelize());
    try {
        const {
            id,
            is_read                            
        } = req.body;
        console.log("req.body", req.body);

        const user = await Notifications.update(
            {
                is_read                
            },
            {
                where: { id: id }
            }
        );   

        res.json({ message: "Notification Updated Successfully", data: user });
                
       
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});



export default notificationRouter;
