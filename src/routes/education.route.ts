import express from 'express';
import UserEducation, { initializeUEducationModel } from '../models/UserEducation';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import Departments, { initializeDepartmentModel } from '../models/Department';
import Courses, { initializeCourseModel } from '../models/Course';
import Groups, { initializeGroupModel } from '../models/Group';
import UserGroup, { initializeUGroupModel } from '../models/UserGroup';
import Institutes , { initializeInstitutesModel } from '../models/Institute';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const educationRouter = express.Router();

educationRouter.get('/', auth, async (req, res) => {
    initializeUEducationModel(getSequelize());
    initializeDepartmentModel(getSequelize());
    initializeCourseModel(getSequelize());
    Departments.hasMany(UserEducation, {foreignKey: 'department_id'});
    UserEducation.belongsTo(Departments, {foreignKey: 'department_id', targetKey: 'id'});
    
    Courses.hasMany(UserEducation, {foreignKey: 'course_id'});
    UserEducation.belongsTo(Courses, {foreignKey: 'course_id', targetKey: 'id'});

    let filterwhere;
    

    if (req.query.hasOwnProperty('filter_user')) {
        filterwhere = {
              user_id: req.query.filter_user
        };
    }
    

    const usereducation = await UserEducation.findAll({
         include: [{
          model: Departments,
          required: false
        },
        {
            model: Courses,
            required: false
          }
    ],
    where: filterwhere,
    order: [['id', 'ASC']],
    
      });
      
    
    res.status(200).json({ total_records: 10, data: usereducation });

});

educationRouter.get('/:id', auth, async (req, res) => {
    initializeUEducationModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const education = await UserEducation.findOne({ where: { id: req.params.id } });
   
    const educationDetails = JSON.parse(JSON.stringify(education));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!education) {
        res.status(500).json({ message: "Invalid Education" });
        return;
    }
    res.json({ message: "Education Details", data: educationDetails });

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

educationRouter.post('/add', auth, async (req, res) => {
    initializeUEducationModel(getSequelize());
    initializeDepartmentModel(getSequelize());
    initializeCourseModel(getSequelize());
    initializeGroupModel(getSequelize());
    initializeUGroupModel(getSequelize());
    initializeInstitutesModel(getSequelize());
    try {
        const {
            id,
            user_id,            
            degree,
            course_id,
            department_id,
            specialization,
            is_additional,
            start_year,
            end_year,
            location          
        } = req.body;

        let university = req.body.university;

        const institute_id = (req as any).instituteId;
        const yeargroupname = "Batch of "+end_year;

        const institutedata = await Institutes.findOne({ where: { id: institute_id } });
        if(is_additional==0){
             university = institutedata?.institute_name;
        } 
        
        
        if (id) {
            const education = await UserEducation.update(
                {
                    university,
                    degree,
                    course_id,
                    department_id,
                    specialization,
                    is_additional,
                    start_year,
                    end_year,
                    location                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Education Updated", data: education });
        } else {
            const alumnimessage = await UserEducation.create({
                user_id,
                university,
                degree,
                course_id,
                department_id,
                specialization,
                is_additional,
                start_year,
                end_year,
                location
            });
            if(is_additional==0){
            const group = await Groups.findOne({ where: { group_name: yeargroupname, institute_id: institute_id } });

            const coursename = await Courses.findOne({ where: { id: course_id } });

            const departname = await Departments.findOne({ where: { id: department_id } });

            let coursegroupname;

            if(departname){
                coursegroupname = coursename?.course_shortcode+" "+end_year+", "+departname?.department_shortcode;
            } else{
                coursegroupname = coursename?.course_shortcode+" "+end_year;
            }
            
   
            const coursegroup = await Groups.findOne({ where: { group_name: coursegroupname, institute_id: institute_id } });

            if(group){
                var group_id = group.id;  
                const usergroupdata = await UserGroup.findOne({ where: { user_id: user_id, group_id:group_id } });
                if(!usergroupdata){
                const usergroup = await UserGroup.create({
                    user_id,
                    group_id,                    
                }); 
                }             
            } else{
                const group_name= yeargroupname;
                const groupdata = await Groups.create({
                    institute_id,
                    group_name                    
                });
                var group_id = groupdata.id; 
                const usergroup = await UserGroup.create({
                    user_id,
                    group_id,                    
                });
            }

            if(coursegroup){
                var group_id = coursegroup.id;  
                const usergroupdata = await UserGroup.findOne({ where: { user_id: user_id, group_id:group_id } });
                if(!usergroupdata){
                const usergroup = await UserGroup.create({
                    user_id,
                    group_id,                    
                }); 
                }             
            } else{
                const group_name= coursegroupname;
                const groupdata = await Groups.create({
                    institute_id,
                    group_name                    
                });
                var group_id = groupdata.id; 
                const usergroup = await UserGroup.create({
                    user_id,
                    group_id,                    
                });
            }
        }
            res.json({ message: "Education Added", data: alumnimessage });
        }
        
    }catch (error) {
        res.status(500).json({ message: catchError(error) });
    }

});

educationRouter.delete('/:id', auth, async (req, res) => {
    initializeUEducationModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const education = await UserEducation.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!education) {
        res.status(500).json({ message: "Invalid Education" });
        return;
    }

    try {
     await UserEducation.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Education Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Education" });
            return;
      }

});



export default educationRouter;
