import express from 'express';
import Users from '../models/User';
import Industries, { initializeIndustryModel } from '../models/Industry';
import { getSequelize } from '../config/db';
import UserIndustry from '../models/UserIndustry';
import UserProfessionalskill from '../models/UserProfessionalskill';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const industryRouter = express.Router();

industryRouter.get('/', async (req, res) => {
    initializeIndustryModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;

    const industry = await Industries.findAll({        
        where: {institute_id: instituteId}});
    res.status(200).json({ total_records: 10, data: industry });

});


industryRouter.get('/:id', auth, async (req, res) => {
    initializeIndustryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const instituteId = (req as any).instituteId;

    const industry = await Industries.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("industry", industry);
    const industryDetails = JSON.parse(JSON.stringify(industry));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!industry) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }
    res.json({ message: "Industry Details", data: industryDetails });

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
industryRouter.post('/create', async (req, res) => {
    initializeIndustryModel(getSequelize());
    try {
        const {
            id,
            industry_name,
            status                     
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let industry: Industries | null;
        if (id) {
            industry = await Industries.findOne({ where: { industry_name: industry_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", industry);
        } else {
            industry = await Industries.findOne({ where: { industry_name: industry_name, institute_id: institute_id } });
        }
        if (industry) {
            res.status(500).json({ message: "Industry already exist." });
            return;
        }

        if (id) {
            const industry = await Industries.update(
                {
                    industry_name,
                    status                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Industry Updated", data: industry });
        } else {
                               

                    const industry = await Industries.create({
                        institute_id,
                        industry_name,
                        status
                    });
                    res.json({ message: "Industry Created", data: industry });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});

industryRouter.post('/createusercompany', async (req, res) => {
    initializeIndustryModel(getSequelize());
    try {
        const {
            id,
            user_id,
            company_name,
            position,
            company_start_period,
            company_end_period,
            total_experience,
            industry_id,
            skill_id                     
        } = req.body;
        console.log("req.body", req.body);

        const user = await Users.update(
            {
                company_name,
                position,
                company_start_period,
                company_end_period,
                total_experience                
            },
            {
                where: { id: user_id }
            }
        );

        const industryNumbers = industry_id.map((mn:number) => {
            return { user_id: user_id, industry_id: mn };
        });
         
            
        const userindustry = await UserIndustry.bulkCreate(industryNumbers);

        const skillNumbers = skill_id.map((mn:number) => {
            return { user_id: user_id, skill_id: mn };
        });        
            
        const userskill = await UserProfessionalskill.bulkCreate(skillNumbers);

                    
                    res.json({ message: "Company Added Successfully", data: user });

                
       
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


industryRouter.delete('/:id', auth, async (req, res) => {
    initializeIndustryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute_id = (req as any).instituteId;

    const industry = await Industries.findOne({ where: { id: req.params.id, institute_id: institute_id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!industry) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }

    try {
     await Industries.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Industry Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Industry" });
            return;
      }

});

industryRouter.get('/status/:id', auth, async (req, res) => {
    initializeIndustryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const industry = await Industries.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!industry) {
        res.status(500).json({ message: "Invalid Industry" });
        return;
    }

    try {

        if(industry.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const industrynew = await Industries.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Industry Updated", data: industrynew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Industry" });
            return;
      }

});

export default industryRouter;
