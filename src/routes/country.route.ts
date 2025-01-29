import express from 'express';
import Countrys, { initializeCountryModel } from '../models/Country';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const countryRouter = express.Router();

countryRouter.get('/', async (req, res) => {
    initializeCountryModel(getSequelize());
    console.log("req", req.body);
    const country = await Countrys.findAll();
    res.status(200).json({ total_records: 10, data: country });

});


countryRouter.get('/:id', auth, async (req, res) => {
    initializeCountryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const country = await Countrys.findOne({ where: { id: req.params.id } });
    console.log("country", country);
    const countryDetails = JSON.parse(JSON.stringify(country));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!country) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }
    res.json({ message: "Country Details", data: countryDetails });

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
countryRouter.post('/create', async (req, res) => {
    initializeCountryModel(getSequelize());
    try {
        const {
            id,
            country_name,
            country_short_code,
            country_phone_code,
            status                     
        } = req.body;
        console.log("req.body", req.body);

        let country: Countrys | null;
        if (id) {
            country = await Countrys.findOne({ where: { country_name: country_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", country);
        } else {
            country = await Countrys.findOne({ where: { country_name: country_name } });
        }
        if (country) {
            res.status(500).json({ message: "Country already exist." });
            return;
        }

        if (id) {
            const country = await Countrys.update(
                {
                    country_name,
                    country_short_code,
                    country_phone_code,
                    status                   
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Country Updated", data: country });
        } else {
                               

                    const country = await Countrys.create({
                        country_name,
                        country_short_code,
                        country_phone_code,
                        status
                    });
                    res.json({ message: "Country Created", data: country });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


countryRouter.delete('/:id', auth, async (req, res) => {
    initializeCountryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const country = await Countrys.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!country) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }

    try {
     await Countrys.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Country Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Country" });
            return;
      }

});

countryRouter.get('/status/:id', auth, async (req, res) => {
    initializeCountryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const country = await Countrys.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!country) {
        res.status(500).json({ message: "Invalid Country" });
        return;
    }

    try {

        if(country.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const countrynew = await Countrys.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Country Updated", data: countrynew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Country" });
            return;
      }

});



export default countryRouter;
