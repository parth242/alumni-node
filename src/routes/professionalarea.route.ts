import express from 'express';
import Professionalareas, { initializeAreaModel } from '../models/Professionalarea';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const professionalareaRouter = express.Router();

professionalareaRouter.get('/', async (req, res) => {
    initializeAreaModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;

    const professionalarea = await Professionalareas.findAll({        
        where: {institute_id: instituteId}});
    res.status(200).json({ total_records: 10, data: professionalarea });

});


professionalareaRouter.get('/:id', auth, async (req, res) => {
    initializeAreaModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const instituteId = (req as any).instituteId;

    const professionalarea = await Professionalareas.findOne({ where: { id: req.params.id, institute_id: instituteId } });
    console.log("professionalarea", professionalarea);
    const professionalareaDetails = JSON.parse(JSON.stringify(professionalarea));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalarea) {
        res.status(500).json({ message: "Invalid Professionalarea" });
        return;
    }
    res.json({ message: "Professionalarea Details", data: professionalareaDetails });

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
professionalareaRouter.post('/create', async (req, res) => {
    initializeAreaModel(getSequelize());
    try {
        const {
            id,
            area_name,
            status                    
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let professionalarea: Professionalareas | null;
        if (id) {
            professionalarea = await Professionalareas.findOne({ where: { area_name: area_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", professionalarea);
        } else {
            professionalarea = await Professionalareas.findOne({ where: { area_name: area_name, institute_id: institute_id } });
        }
        if (professionalarea) {
            res.status(500).json({ message: "Professionalarea already exist." });
            return;
        }

        if (id) {
            const professionalarea = await Professionalareas.update(
                {
                    area_name,
                    status                   
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Professionalarea Updated", data: professionalarea });
        } else {
                               

                    const professionalarea = await Professionalareas.create({
                        institute_id,
                        area_name,
                        status
                    });
                    res.json({ message: "Professionalarea Created", data: professionalarea });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


professionalareaRouter.delete('/:id', auth, async (req, res) => {
    initializeAreaModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute_id = (req as any).instituteId;

    const professionalarea = await Professionalareas.findOne({ where: { id: req.params.id, institute_id: institute_id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalarea) {
        res.status(500).json({ message: "Invalid Professionalarea" });
        return;
    }

    try {
     await Professionalareas.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Professionalarea Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Professionalarea" });
            return;
      }

});

professionalareaRouter.get('/status/:id', auth, async (req, res) => {
    initializeAreaModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const professionalarea = await Professionalareas.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!professionalarea) {
        res.status(500).json({ message: "Invalid Professionalarea" });
        return;
    }

    try {

        if(professionalarea.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const professionalareanew = await Professionalareas.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Professionalarea Updated", data: professionalareanew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Professionalarea" });
            return;
      }

});



export default professionalareaRouter;
