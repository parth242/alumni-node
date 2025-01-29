import express from 'express';
import Departments, { initializeDepartmentModel } from '../models/Department';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import Courses, { initializeCourseModel } from '../models/Course';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const departmentRouter = express.Router();

departmentRouter.get('/', async (req, res) => {
    initializeDepartmentModel(getSequelize());
    initializeCourseModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;

    Courses.hasMany(Departments, { foreignKey: "course_id" });
	Departments.belongsTo(Courses, { foreignKey: "course_id", targetKey: "id" });

    const department = await Departments.findAll({
        include: [
			{
				model: Courses,
				required: true,
				attributes: ["course_name","course_shortcode"],
			},			
		],
        where: {institute_id: instituteId}});
    res.status(200).json({ total_records: 10, data: department });

});


departmentRouter.get('/:id', auth, async (req, res) => {
    initializeDepartmentModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const instituteId = (req as any).instituteId;
    const department = await Departments.findOne({ where: { id: req.params.id, institute_id: instituteId} });
    console.log("department", department);
    const departmentDetails = JSON.parse(JSON.stringify(department));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!department) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }
    res.json({ message: "Department Details", data: departmentDetails });

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

departmentRouter.delete('/:id', auth, async (req, res) => {
    initializeDepartmentModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute_id = (req as any).instituteId;
    const department = await Departments.findOne({ where: { id: req.params.id, institute_id: institute_id} });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!department) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }

    try {
     await Departments.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Department Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Department" });
            return;
      }

});

departmentRouter.get('/status/:id', auth, async (req, res) => {
    initializeDepartmentModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const department = await Departments.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!department) {
        res.status(500).json({ message: "Invalid Department" });
        return;
    }

    try {

        if(department.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const departmentnew = await Departments.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Department Updated", data: departmentnew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Department" });
            return;
      }

});

departmentRouter.post('/create', async (req, res) => {
    initializeDepartmentModel(getSequelize());
    try {
        const {
            id,
            department_name,
            department_shortcode,
            course_id,
            status                     
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let department: Departments | null;
        if (id) {
            department = await Departments.findOne({ where: { department_name: department_name, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", department);
        } else {
            department = await Departments.findOne({ where: { department_name: department_name, institute_id: institute_id } });
        }
        if (department) {
            res.status(500).json({ message: "Department already exist." });
            return;
        }

        if (id) {
            const department = await Departments.update(
                {
                    department_name,
                    department_shortcode,
                    course_id,
                    status                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Department Updated", data: department });
        } else {
                               

                    const department = await Departments.create({
                        institute_id,
                        department_name,
                        department_shortcode,
                        course_id,
                        status                        
                    });
                    res.json({ message: "Department Created", data: department });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default departmentRouter;
