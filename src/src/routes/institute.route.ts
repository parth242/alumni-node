import express from 'express';
import Institutes, { initializeInstitutesModel } from '../models/Institute';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const instituteRouter = express.Router();

instituteRouter.get('/', async (req, res) => {
    initializeInstitutesModel(getSequelize());
    console.log("req", req.body);
    const institute = await Institutes.findAll();
    res.status(200).json({ total_records: 10, data: institute });

});


instituteRouter.get('/:id', auth, async (req, res) => {
    initializeInstitutesModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute = await Institutes.findOne({ where: { id: req.params.id } });
    console.log("institute", institute);
    const instituteDetails = JSON.parse(JSON.stringify(institute));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }
    res.json({ message: "Institute Details", data: instituteDetails });

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
instituteRouter.post('/create', async (req, res) => {
    initializeInstitutesModel(getSequelize());
    try {
        const {
            id,
            institute_id,
            institute_name,
            institute_siteurl,
            university_id,
            status                     
        } = req.body;
        console.log("req.body", req.body);

        let institute: Institutes | null;
        if (id) {
            institute = await Institutes.findOne({ where: { institute_name: institute_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", institute);
        } else {
            institute = await Institutes.findOne({ where: { institute_name: institute_name } });
        }
        if (institute) {
            res.status(500).json({ message: "Institute already exist." });
            return;
        }

        if (id) {
            const institute = await Institutes.update(
                {
                    institute_name,
                    institute_siteurl,
                    university_id,
                    status                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Institute Updated", data: institute });
        } else {
                               

                    const institute = await Institutes.create({
                        institute_id,
                        institute_name,
                        institute_siteurl,
                        university_id,
                        status
                    });
                    res.json({ message: "Institute Created", data: institute });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


instituteRouter.delete('/:id', auth, async (req, res) => {
    initializeInstitutesModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute = await Institutes.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }

    try {
     await Institutes.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Institute Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Institute" });
            return;
      }

});

instituteRouter.get('/status/:id', auth, async (req, res) => {
    initializeInstitutesModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute = await Institutes.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }

    try {

        if(institute.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const institutenew = await Institutes.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Institute Updated", data: institutenew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Institute" });
            return;
      }

});

instituteRouter.get('/updateInstituteId/:id', auth, async (req, res) => {
    initializeInstitutesModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute = await Institutes.findOne({ where: { institute_id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!institute) {
        res.status(500).json({ message: "Invalid Institute" });
        return;
    }

    try {

        res.cookie('institute_id', req.params.id, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent cross-site request forgery (CSRF)
            maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
        });
        res.json({ message: "Institute Updated", data: institute });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Institute" });
            return;
      }

});



export default instituteRouter;
