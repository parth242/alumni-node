import express from 'express';
import Professionalskills, { initializeSkillModel } from '../models/Professionalskill';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const professionalskillRouter = express.Router();

professionalskillRouter.get('/', async (req, res) => {
    initializeSkillModel(getSequelize());
    console.log("req", req.body);
    const professionalskill = await Professionalskills.findAll();
    res.status(200).json({ total_records: 10, data: professionalskill });

});


professionalskillRouter.get('/:id', auth, async (req, res) => {
    initializeSkillModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const professionalskill = await Professionalskills.findOne({ where: { id: req.params.id } });
    console.log("professionalskill", professionalskill);
    const professionalskillDetails = JSON.parse(JSON.stringify(professionalskill));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }
    res.json({ message: "Professionalskill Details", data: professionalskillDetails });

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

professionalskillRouter.delete('/:id', auth, async (req, res) => {
    initializeSkillModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const professionalskill = await Professionalskills.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }

    try {
     await Professionalskills.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Professionalskill Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Professionalskill" });
            return;
      }

});

professionalskillRouter.get('/status/:id', auth, async (req, res) => {
    initializeSkillModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const professionalskill = await Professionalskills.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalskill) {
        res.status(500).json({ message: "Invalid Professionalskill" });
        return;
    }

    try {

        if(professionalskill.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const professionalskillnew = await Professionalskills.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Professionalskill Updated", data: professionalskillnew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Professionalskill" });
            return;
      }

});

professionalskillRouter.post('/create', async (req, res) => {
    initializeSkillModel(getSequelize());
    try {
        const {
            id,
            skill_name,
            status                    
        } = req.body;
        const institute_id = (req as any).instituteId;
        console.log("req.body", req.body);
        console.log("institute_id", institute_id);
        

        let professionalskill: Professionalskills | null;
        if (id) {
            professionalskill = await Professionalskills.findOne({ where: { skill_name: skill_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", professionalskill);
        } else {
            professionalskill = await Professionalskills.findOne({ where: { skill_name: skill_name, institute_id: institute_id } });
        }
        if (professionalskill) {
            res.status(500).json({ message: "Professionalskill already exist." });
            return;
        }

        if (id) {
            const professionalskill = await Professionalskills.update(
                {
                    skill_name,
                    status                   
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Professionalskill Updated", data: professionalskill });
        } else {
                               

                    const professionalskill = await Professionalskills.create({
                        institute_id,
                        skill_name,
                        status
                    });
                    res.json({ message: "Professionalskill Created", data: professionalskill });

                
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ message: catchError(error) });
    }
});






export default professionalskillRouter;
