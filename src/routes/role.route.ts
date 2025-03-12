import express from 'express';
import Roles, { initializeRoleModel } from '../models/Role';
import { getSequelize } from '../config/db';
import RolePermission, { initializeRPermissionModel } from '../models/RolePermission';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const roleRouter = express.Router();

roleRouter.get('/', auth, async (req, res) => {
    initializeRoleModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;
    const role = await Roles.findAll({where: {institute_id: instituteId}});
    res.status(200).json({ total_records: 10, data: role });

});

roleRouter.get('/role_id=:roleid', auth, async (req, res) => {
    initializeRPermissionModel(getSequelize());
    console.log("req", req.body);
    console.log("reqroleid", req.params.roleid);
    const rolepermission = await RolePermission.findAll({ where: { role_id: req.params.roleid },attributes: ['module_id']});

    interface RolePermissionAttributes {
        module_id: number;
        // Add other properties as needed
      }
       
        const roleWithPermissions = rolepermission.map((permission: RolePermissionAttributes) => (
            permission.module_id
        
        ));
        

    res.status(200).json({ data: roleWithPermissions });

});

roleRouter.get('/:id', auth, async (req, res) => {
    initializeRoleModel(getSequelize());
    console.log("req.params.id", req.params.id);
    Roles.hasMany(RolePermission, {foreignKey: 'role_id'});
    RolePermission.belongsTo(Roles, {foreignKey: 'role_id', targetKey: 'id'});
    const role = await Roles.findOne({ 
        include: [{
            model: RolePermission,
            required: true,
            attributes: ['module_id'],
            separate: true,
          }
      ],
        where: { id: req.params.id } });
    // Access the result, and you'll find the specified column from RolePermission nested inside the main array

    // Assuming RolePermission model has a columnName property
interface RolePermissionAttributes {
    module_id: number;
    // Add other properties as needed
  }

    if (role !== null) {
const roleWithPermissions = role.toJSON();
console.log('roleWithPermissions',roleWithPermissions.role_permissions);
if (roleWithPermissions.role_permissions) {
roleWithPermissions.menu = roleWithPermissions.role_permissions.map((permission: RolePermissionAttributes) => (
    String(permission.module_id)

));
console.log(roleWithPermissions);

const roleDetails = JSON.parse(JSON.stringify(roleWithPermissions));
if (!role) {
    res.status(500).json({ message: "Invalid Role" });
    return;
}
res.json({ message: "Role Details", data: roleDetails });
} 

}  else{
    res.status(500).json({ message: "Invalid Role" });
    return;
}
    
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    

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

roleRouter.delete('/:id', auth, async (req, res) => {
    initializeRoleModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const role = await Roles.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!role) {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }

    try {
     await Roles.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Role Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Role" });
            return;
      }

});

roleRouter.get('/status/:id', auth, async (req, res) => {
    initializeRoleModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const role = await Roles.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!role) {
        res.status(500).json({ message: "Invalid Role" });
        return;
    }

    try {

        if(role.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const rolenew = await Roles.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Role Updated", data: rolenew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Role" });
            return;
      }

});

roleRouter.post('/create', async (req, res) => {
    initializeRoleModel(getSequelize());
    try {
        const {
            id,
            name,
            status,
            menu                   
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let role: Roles | null;
        if (id) {
            role = await Roles.findOne({ where: { name: name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", role);
        } else {
            role = await Roles.findOne({ where: { name: name, institute_id: institute_id } });
        }
        if (role) {
            res.status(500).json({ message: "Role already exist." });
            return;
        }
        
        if (id) {
            const role = await Roles.update(
                {
                    name,
                    status                  
                },
                {
                    where: { id: id }
                }
            );

            await RolePermission.destroy({
                where: { role_id: id }
            });

            const doubledNumbers = menu.map((mn: string) => {
                return { role_id: id, module_id: Number(mn) };
            });
             
                
            const rolepermission = await RolePermission.bulkCreate(doubledNumbers);

            res.json({ message: "Role Updated", data: role });
        } else {
                               

                    const role = await Roles.create({
                        institute_id,
                        name,
                        status
                    });
                    const lastInsertedId = role.id;
                    //console.log("menu",menu);
                    const doubledNumbers = menu.map((mn: string) => {
                        return { role_id: lastInsertedId, module_id: Number(mn) };
                    });
                     
                        console.log("doubledNumbers",doubledNumbers);
                    const rolepermission = await RolePermission.bulkCreate(doubledNumbers);
                    console.log(rolepermission);
                    res.json({ message: "Role Created", data: role });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default roleRouter;
