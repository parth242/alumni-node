import express from 'express';
import Categorys, { initializeCategoryModel } from '../models/Category';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const categoryRouter = express.Router();

categoryRouter.get('/', async (req, res) => {
    initializeCategoryModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;
    const category = await Categorys.findAll({where: {institute_id: instituteId}});
    res.status(200).json({ total_records: 10, data: category });

});


categoryRouter.get('/:id', auth, async (req, res) => {
    initializeCategoryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const instituteId = (req as any).instituteId;
    const category = await Categorys.findOne({ where: { id: req.params.id, institute_id: instituteId} });
    console.log("category", category);
    const categoryDetails = JSON.parse(JSON.stringify(category));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!category) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }
    res.json({ message: "Category Details", data: categoryDetails });

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

categoryRouter.delete('/:id', auth, async (req, res) => {
    initializeCategoryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute_id = (req as any).instituteId;
    const category = await Categorys.findOne({ where: { id: req.params.id, institute_id: institute_id} });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!category) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }

    try {
     await Categorys.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Category Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Category" });
            return;
      }

});

categoryRouter.get('/status/:id', auth, async (req, res) => {
    initializeCategoryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const category = await Categorys.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!category) {
        res.status(500).json({ message: "Invalid Category" });
        return;
    }

    try {

        if(category.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const categorynew = await Categorys.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Category Updated", data: categorynew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Category" });
            return;
      }

});

categoryRouter.post('/create', async (req, res) => {
    initializeCategoryModel(getSequelize());
    try {
        const {
            id,
            category_name,
            status                     
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let category: Categorys | null;
        if (id) {
            category = await Categorys.findOne({ where: { category_name: category_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", category);
        } else {
            category = await Categorys.findOne({ where: { category_name: category_name, institute_id: institute_id } });
        }
        if (category) {
            res.status(500).json({ message: "Category already exist." });
            return;
        }

        if (id) {
            const category = await Categorys.update(
                {
                    category_name,
                    status                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Category Updated", data: category });
        } else {
                               

                    const category = await Categorys.create({
                        category_name,
                        status,
                        institute_id
                    });
                    res.json({ message: "Category Created", data: category });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default categoryRouter;
