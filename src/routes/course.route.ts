import express from 'express';
import Courses, { initializeCourseModel } from '../models/Course';
import { getSequelize } from '../config/db';
import UserCourse from '../models/UserCourse';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const courseRouter = express.Router();

courseRouter.get('/', async (req, res) => {
    initializeCourseModel(getSequelize());
    console.log("req", req.body);
    const instituteId = (req as any).instituteId;
    const course = await Courses.findAll({where: {institute_id: instituteId}});
    res.status(200).json({ total_records: 10, data: course });

});


courseRouter.get('/:id', auth, async (req, res) => {
    initializeCourseModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const instituteId = (req as any).instituteId;

    const course = await Courses.findOne({ where: { id: req.params.id, institute_id: instituteId} });
    console.log("course", course);
    const courseDetails = JSON.parse(JSON.stringify(course));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!course) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }
    res.json({ message: "Course Details", data: courseDetails });

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

courseRouter.delete('/:id', auth, async (req, res) => {
    initializeCourseModel(getSequelize());
    const institute_id = (req as any).instituteId;
    console.log("req.params.id", req.params.id);
    const course = await Courses.findOne({ where: { id: req.params.id, institute_id: institute_id} });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!course) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }

    try {
     await Courses.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Course Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Course" });
            return;
      }

});

courseRouter.get('/status/:id', auth, async (req, res) => {
    initializeCourseModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const course = await Courses.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!course) {
        res.status(500).json({ message: "Invalid Course" });
        return;
    }

    try {

        if(course.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const coursenew = await Courses.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Course Updated", data: coursenew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Course" });
            return;
      }

});

courseRouter.post('/create', async (req, res) => {
    initializeCourseModel(getSequelize());
    try {
        const {
            id,
            course_name,
            course_shortcode,
            course_level,
            status                     
        } = req.body;

        const institute_id = (req as any).instituteId;
        console.log("req.body", req.body);

        let course: Courses | null;
        if (id) {
            course = await Courses.findOne({ where: { course_name: course_name, institute_id:institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", course);
        } else {
            course = await Courses.findOne({ where: { course_name: course_name, institute_id:institute_id } });
        }
        if (course) {
            res.status(500).json({ message: "Course already exist." });
            return;
        }

        if (id) {
            const course = await Courses.update(
                {
                    course_name,
                    course_shortcode,
                    course_level,
                    status                    
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Course Updated", data: course });
        } else {
                               

                    const course = await Courses.create({
                        course_name,
                        course_shortcode,
                        course_level,
                        status,
                        institute_id
                    });
                    res.json({ message: "Course Created", data: course });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


courseRouter.post('/createusercourse', async (req, res) => {
    initializeCourseModel(getSequelize());
    try {
        const {
            id,
            user_id,
            coursedata                     
        } = req.body;
        console.log("req.body", req.body);


        const doubledNumbers = coursedata.map((mn:any) => {
            return { user_id: user_id, course_id: mn.course_id, end_date:mn.end_date };
        });
         
            
        const usercourse = await UserCourse.bulkCreate(doubledNumbers);

                    
                    res.json({ message: "Course Added Successfully", data: usercourse });

                
       
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});



export default courseRouter;
