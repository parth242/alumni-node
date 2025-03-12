import express from 'express';
import Settings, { initializeSettingModel } from '../models/Setting';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const settingRouter = express.Router();

settingRouter.get('/', async (req, res) => {
    initializeSettingModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;
    
    const setting = await Settings.findOne({        
        where: {institute_id: instituteId},
        order: [['id', 'DESC']],
        offset: 0, // Set the offset
        limit: 1
          });
    res.json({ data: setting });

});


settingRouter.get('/:id', auth, async (req, res) => {
    initializeSettingModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const setting = await Settings.findOne({ where: { id: req.params.id } });
    console.log("setting", setting);
    const settingDetails = JSON.parse(JSON.stringify(setting));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!setting) {
        res.status(500).json({ message: "Invalid Setting" });
        return;
    }
    res.json({ message: "Setting Details", data: settingDetails });

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



settingRouter.post('/create', async (req, res) => {
    initializeSettingModel(getSequelize());
    try {
        const {
            id,
            collage_name,
            collage_logo,
            contact_name,
            contact_mobileno                    
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let settingrecord: Settings | null;
       
        settingrecord = await Settings.findOne({        
                where: {institute_id: institute_id},
                order: [['id', 'DESC']],
                offset: 0, // Set the offset
                limit: 1
                  });

            
            
      
        if (settingrecord) {
            var settingid = settingrecord?.dataValues.id;
            const setting = await Settings.update(
                {
                    collage_name,
                    collage_logo,
                    contact_name,
                    contact_mobileno               
                },
                {
                    where: { id: settingid }
                }
            );
            res.json({ message: "Setting Updated", data: setting });
        } else {
                               

                    const setting = await Settings.create({
                        institute_id,
                        collage_name,
                        collage_logo,
                        contact_name,
                        contact_mobileno
                    });
                    res.json({ message: "Setting Created", data: setting });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default settingRouter;
