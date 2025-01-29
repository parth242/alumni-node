import express from 'express';
import EmailTemplates, { initializeEmailTemplateModel } from '../models/EmailTemplate';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const emailtemplateRouter = express.Router();

emailtemplateRouter.get('/', async (req, res) => {
    initializeEmailTemplateModel(getSequelize());
    console.log("req", req.body);
    
    const emailtemplate = await EmailTemplates.findOne({        
       
        order: [['id', 'DESC']],
        offset: 0, // Set the offset
        limit: 1
          });
    res.json({ data: emailtemplate });

});


emailtemplateRouter.get('/:id', auth, async (req, res) => {
    initializeEmailTemplateModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const emailtemplate = await EmailTemplates.findOne({ where: { id: req.params.id } });
    console.log("emailtemplate", emailtemplate);
    const emailtemplateDetails = JSON.parse(JSON.stringify(emailtemplate));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!emailtemplate) {
        res.status(500).json({ message: "Invalid EmailTemplate" });
        return;
    }
    res.json({ message: "EmailTemplate Details", data: emailtemplateDetails });

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



emailtemplateRouter.post('/create', async (req, res) => {
    initializeEmailTemplateModel(getSequelize());
    try {
        const {
            id,
            alumni_register_mail_admin,
            alumni_register_mail,
            alumni_confirm_mail,
            alumni_reset_password_mail,     
            new_event_mail,
            new_job_mail,
            update_job_status,
            refer_job_friend,
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let emailtemplaterecord: EmailTemplates | null;
       
        emailtemplaterecord = await EmailTemplates.findOne({        
       
                order: [['id', 'DESC']],
                offset: 0, // Set the offset
                limit: 1
                  });

            
            
      
        if (emailtemplaterecord) {
            var emailtemplateid = emailtemplaterecord?.dataValues.id;
            const emailtemplate = await EmailTemplates.update(
                {
                    alumni_register_mail_admin,
                    alumni_register_mail,
                    alumni_confirm_mail, 
                    alumni_reset_password_mail,
                    new_event_mail,
                    new_job_mail,
                    update_job_status,
                    refer_job_friend,                                
                },
                {
                    where: { id: emailtemplateid }
                }
            );
            res.json({ message: "EmailTemplate Updated", data: emailtemplate });
        } else {
                               

                    const emailtemplate = await EmailTemplates.create({
                        institute_id,
                        alumni_register_mail_admin,
                        alumni_register_mail,
                        alumni_confirm_mail,
                        alumni_reset_password_mail,
                        new_event_mail,
                        new_job_mail,
                        update_job_status,
                        refer_job_friend,                    
                    });
                    res.json({ message: "EmailTemplate Created", data: emailtemplate });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default emailtemplateRouter;
