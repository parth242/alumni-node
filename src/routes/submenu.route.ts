import express from 'express';
import Submenus, { initializeSubmenuModel } from '../models/Submenu';
import Homemenus, { initializeHomemenuModel } from '../models/Homemenu';
import { getSequelize } from '../config/db';
import RolePermission from '../models/RolePermission';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const submenuRouter = express.Router();



submenuRouter.get('/headermenu', async (req, res) => {
    initializeHomemenuModel(getSequelize());
    console.log("req", req.body);
    
    const submenu = await Homemenus.findAll({ where: { menu: 1, action:"View", is_footermenu: 0, mainmodule_id: 0 },order: [['ordering', 'ASC']] });
    res.status(200).json({ total_records: 10, data: submenu });

});

submenuRouter.get('/mainmodule_id=:mainmoduleid', async (req, res) => {
    initializeHomemenuModel(getSequelize());
    console.log("req", req.body);
    
    const submenu = await Homemenus.findAll({ where: { menu: 1, action:"View", is_footermenu: 0, mainmodule_id: req.params.mainmoduleid },order: [['ordering', 'ASC']] });
    const submenuCount = await Homemenus.count({ where: { menu: 1, action:"View", is_footermenu: 0, mainmodule_id: req.params.mainmoduleid } });
    res.status(200).json({ total_records: submenuCount, data: submenu });

});

submenuRouter.get('/footermenu', async (req, res) => {
    initializeHomemenuModel(getSequelize());
    console.log("req", req.body);
    
    const submenu = await Homemenus.findAll({ where: { menu: 1, action:"View", is_footermenu: 1 },order: [['ordering', 'ASC']] });
    res.status(200).json({ total_records: 10, data: submenu });

});

submenuRouter.get('/', auth, async (req, res) => {
    initializeSubmenuModel(getSequelize());
    console.log("req", req.body);
    
    const submenu = await Submenus.findAll({ where: { menu: 1, action:"View" },order: [['ordering', 'ASC']] });
    res.status(200).json({ total_records: 10, data: submenu });

});

submenuRouter.get('/action=:actionpage&module_alias=:modulealias', auth, async (req, res) => {
    initializeSubmenuModel(getSequelize());
    console.log("req", req.body);
    console.log("req.params.modulealias", req.params.modulealias);
    const submenu = await Submenus.findOne({ where: { module_alias: req.params.modulealias,action: req.params.actionpage },attributes: ['id'] });
    console.log('submenudepart',submenu);
    const submenuDetails = JSON.parse(JSON.stringify(submenu));
    res.status(200).json({ data: submenuDetails });

});

submenuRouter.get('/module_alias=:modulealias', auth, async (req, res) => {
    initializeSubmenuModel(getSequelize());
    console.log("req", req.body);
    console.log("req.params.modulealias", req.params.modulealias);
    const submenu = await Submenus.findAll({ where: { module_alias: req.params.modulealias } });
    res.status(200).json({ data: submenu });

});
submenuRouter.get('/:id', auth, async (req, res) => {
    initializeSubmenuModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const submenu = await Submenus.findOne({ where: { id: req.params.id } });
    console.log("submenu", submenu);
    const submenuDetails = JSON.parse(JSON.stringify(submenu));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!submenu) {
        res.status(500).json({ message: "Invalid Submenu" });
        return;
    }
    res.json({ message: "Submenu Details", data: submenuDetails });

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


export default submenuRouter;
