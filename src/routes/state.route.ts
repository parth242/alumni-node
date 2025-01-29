import express from 'express';
import States, { initializeStateModel } from '../models/State';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const stateRouter = express.Router();

stateRouter.get('/', async (req, res) => {
    initializeStateModel(getSequelize());
    console.log("req", req.body);
    
        const state = await States.findAll();
   
    
    res.status(200).json({ total_records: 10, data: state });

});


stateRouter.get('/:id', auth, async (req, res) => {
    initializeStateModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const state = await States.findOne({ where: { id: req.params.id } });
    console.log("state", state);
    const stateDetails = JSON.parse(JSON.stringify(state));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!state) {
        res.status(500).json({ message: "Invalid State" });
        return;
    }
    res.json({ message: "State Details", data: stateDetails });

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
stateRouter.post('/create', async (req, res) => {
    initializeStateModel(getSequelize());
    try {
        const {
            id,
            state_name                     
        } = req.body;
        console.log("req.body", req.body);

        let state: States | null;
        if (id) {
            state = await States.findOne({ where: { state_name: state_name, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", state);
        } else {
            state = await States.findOne({ where: { state_name: state_name } });
        }
        if (state) {
            res.status(500).json({ message: "State already exist." });
            return;
        }

        if (id) {
            const state = await States.update(
                {
                    state_name                   
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "State Updated", data: state });
        } else {
                               

                    const state = await States.create({
                        state_name
                    });
                    res.json({ message: "State Created", data: state });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default stateRouter;
