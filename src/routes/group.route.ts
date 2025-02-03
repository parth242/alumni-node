import express from 'express';
import UserGroup, { initializeUGroupModel } from '../models/UserGroup';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import Groups, { initializeGroupModel } from '../models/Group';
import { Op, WhereOptions  } from 'sequelize';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const groupRouter = express.Router();

groupRouter.get('/', auth, async (req, res) => {
    initializeUGroupModel(getSequelize());
    initializeGroupModel(getSequelize());
    const institute_id = (req as any).instituteId;    
    
    Groups.hasMany(UserGroup, {foreignKey: 'group_id'});
    UserGroup.belongsTo(Groups, {foreignKey: 'group_id', targetKey: 'id'});
    
    
    let whereCondition: WhereOptions<any> = {}; 

    if (req.query.hasOwnProperty('user_id')) {
      
            whereCondition.user_id = req.query.user_id;
       
    }    

    const usergroup = await UserGroup.findAll({
         include: [{
          model: Groups,
          required: false,
          where:{'institute_id':institute_id}
        },        
    ],
    where: whereCondition,
    order: [['id', 'ASC']],
    
      });
      
      
    
    res.status(200).json({ total_records: 10, data: usergroup });

});

groupRouter.get('/:id', auth, async (req, res) => {      
    initializeGroupModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute_id = (req as any).instituteId;    
   

    const group = await Groups.findOne({ where: { id: req.params.id } });
   
    const groupDetails = JSON.parse(JSON.stringify(group));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!group) {
        res.status(500).json({ message: "Invalid Group" });
        return;
    }
    res.json({ message: "Group Details", data: groupDetails });

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

groupRouter.post('/add', auth, async (req, res) => {
    initializeUGroupModel(getSequelize());
    try {
        const {
            id,
            user_id,
            group_id,                   
        } = req.body;

        if (id) {
            const group = await UserGroup.update(
                {
                    user_id,
                    group_id,                    
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Group Updated", data: group });
        } else {
            const alumnimessage = await UserGroup.create({
                user_id,
                group_id,  
            });
            res.json({ message: "Group Added", data: alumnimessage });
        }
        
    }catch (error) {
        res.status(500).json({ message: catchError(error) });
    }

});

groupRouter.delete('/:id', auth, async (req, res) => {
    initializeUGroupModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const group = await UserGroup.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!group) {
        res.status(500).json({ message: "Invalid Group" });
        return;
    }

    try {
     await UserGroup.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Group Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Group" });
            return;
      }

});



export default groupRouter;
