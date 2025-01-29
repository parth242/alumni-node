import express from 'express';
import Users from '../models/User';
import WorkRoles, { initializeWorkModel } from '../models/WorkRole';
import { getSequelize } from '../config/db';
import UserWorkRole from '../models/UserWorkRole';
import UserProfessionalskill from '../models/UserProfessionalskill';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const workroleRouter = express.Router();

workroleRouter.get('/', async (req, res) => {
    initializeWorkModel(getSequelize());
    console.log("req", req.body);
    const workrole = await WorkRoles.findAll();
    res.status(200).json({ total_records: 10, data: workrole });

});


workroleRouter.get('/:id', auth, async (req, res) => {
    initializeWorkModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const workrole = await WorkRoles.findOne({ where: { id: req.params.id } });
    console.log("workrole", workrole);
    const workroleDetails = JSON.parse(JSON.stringify(workrole));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!workrole) {
        res.status(500).json({ message: "Invalid WorkRole" });
        return;
    }
    res.json({ message: "WorkRole Details", data: workroleDetails });

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
workroleRouter.post('/create', async (req, res) => {
    initializeWorkModel(getSequelize());
    try {
        const {
            id,
            workrole_name,
            status                    
        } = req.body;
        console.log("req.body", req.body);

        let workrole: WorkRoles | null;
        if (id) {
            workrole = await WorkRoles.findOne({ where: { workrole_name: workrole_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", workrole);
        } else {
            workrole = await WorkRoles.findOne({ where: { workrole_name: workrole_name } });
        }
        if (workrole) {
            res.status(500).json({ message: "WorkRole already exist." });
            return;
        }

        if (id) {
            const workrole = await WorkRoles.update(
                {
                    workrole_name,
                    status                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "WorkRole Updated", data: workrole });
        } else {
                               

                    const workrole = await WorkRoles.create({
                        workrole_name,
                        status
                    });
                    res.json({ message: "WorkRole Created", data: workrole });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


workroleRouter.delete('/:id', auth, async (req, res) => {
    initializeWorkModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const workrole = await WorkRoles.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!workrole) {
        res.status(500).json({ message: "Invalid WorkRole" });
        return;
    }

    try {
     await WorkRoles.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete WorkRole Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid WorkRole" });
            return;
      }

});

workroleRouter.get('/status/:id', auth, async (req, res) => {
    initializeWorkModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const workrole = await WorkRoles.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!workrole) {
        res.status(500).json({ message: "Invalid WorkRole" });
        return;
    }

    try {

        if(workrole.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const workrolenew = await WorkRoles.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "WorkRole Updated", data: workrolenew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid WorkRole" });
            return;
      }

});


export default workroleRouter;
