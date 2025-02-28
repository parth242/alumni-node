import express from 'express';
import Companies, { initializeCompanyModel } from '../models/Company';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { getSequelize } from '../config/db';
import Users, { initializeUserModel } from '../models/User';
import UserIndustry, { initializeUIndustryModel } from '../models/UserIndustry';
import UserProfessionalskill, { initializeUSkillModel } from '../models/UserProfessionalskill';
import UserWorkRole, { initializeUWorkModel } from '../models/UserWorkRole';
import Industries, { initializeIndustryModel } from '../models/Industry';
import WorkRoles, { initializeWorkModel } from '../models/WorkRole';
import Professionalskills, { initializeSkillModel } from '../models/Professionalskill';

// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const companyRouter = express.Router();

companyRouter.get('/', async (req, res) => {
    initializeCompanyModel(getSequelize());
    console.log("req", req.body);

    let filterwhere;

    if (req.query.hasOwnProperty("filter_user")) {
		filterwhere = {
			...filterwhere,
			user_id: req.query.filter_user,
		};
	}

    const company = await Companies.findAll({where: filterwhere});
    res.status(200).json({ total_records: 10, data: company });

});

companyRouter.get('/experience/:id', auth, async (req, res) => {
    initializeIndustryModel(getSequelize());
    initializeUIndustryModel(getSequelize());
    initializeWorkModel(getSequelize());
    initializeUserModel(getSequelize());
    initializeUWorkModel(getSequelize());
    initializeSkillModel(getSequelize());
    initializeUSkillModel(getSequelize());
    const user = await Users.findOne({ where: { id: req.params.id } });
    
    const userDetails = JSON.parse(JSON.stringify(user));

    Industries.hasMany(UserIndustry, {foreignKey: 'industry_id'});
    UserIndustry.belongsTo(Industries, {foreignKey: 'industry_id', targetKey: 'id'});

    WorkRoles.hasMany(UserWorkRole, {foreignKey: 'workrole_id'});
    UserWorkRole.belongsTo(WorkRoles, {foreignKey: 'workrole_id', targetKey: 'id'});

    Professionalskills.hasMany(UserProfessionalskill, {foreignKey: 'skill_id'});
    UserProfessionalskill.belongsTo(Professionalskills, {foreignKey: 'skill_id', targetKey: 'id'});


    if (!user) {
        res.status(500).json({ message: "Invalid User" });
        return;
    }
    interface UserExp {
        total_experience: number;
        skill_id: number[];
        skill_name: string | null;
        industry_id: number[];
        industry_name: string | null;
        workrole_id: number[];   
        workrole_name: string | null;     
    }
    
    let userexperience: UserExp = { 
        total_experience: userDetails.total_experience,
        skill_id: [], // Initialize as empty arrays or with default values if needed
        skill_name: '',
        industry_id: [],
        industry_name: '',
        workrole_id: [],
        workrole_name: ''
    };
    
    const userindustryall = await UserIndustry.findAll({ 
        include: [{
            model: Industries,
            required: true,
            attributes: ['industry_name']
          }
      ],
        where: { user_id: req.params.id },
        attributes: ['industry_id']
     });
     
    if (!userindustryall) {
        userexperience = {
            ...userexperience,
            industry_id: [],
            industry_name: ''
        };
    } else{
        const industryval = userindustryall.map(record => record.industry_id);  
        const industryNames = userindustryall.map(record => record.dataValues.industry.industry_name).join(', ');
       
        userexperience = {
            ...userexperience,
            industry_id: industryval,
            industry_name: industryNames
        };
    }
    
    const userskill = await UserProfessionalskill.findAll({ 
        include: [{
            model: Professionalskills,
            required: true,
            attributes: ['skill_name']
          }
      ],
        where: { user_id: req.params.id },
        attributes: ['skill_id'] });

    if (!userskill) {
        userexperience = {
            ...userexperience,
            skill_id: [],
            skill_name: ''
        };
    } else{
        const skillval = userskill.map(record => record.skill_id);
        const skillvalname = userskill.map(record => record.dataValues.professionalskill.skill_name).join(', ');
       
        userexperience = {
            ...userexperience,
            skill_id: skillval,
            skill_name: skillvalname
        };
    }

    const userwork = await UserWorkRole.findAll({ 
        include: [{
            model: WorkRoles,
            required: true,
            attributes: ['workrole_name']
          }
      ],
        where: { user_id: req.params.id },
        attributes: ['workrole_id'] });

    if (!userwork) {
        userexperience = {
            ...userexperience,
            workrole_id: [],
            workrole_name: ''
        };
    } else{
        const workval = userwork.map(record => record.workrole_id);
        const workvalname = userwork.map(record => record.dataValues.work_role.workrole_name).join(', ');

        userexperience = {
            ...userexperience,
            workrole_id: workval,
            workrole_name: workvalname
        };
    }

    res.json(userexperience);

});

companyRouter.get('/:id', auth, async (req, res) => {
    initializeCompanyModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const company = await Companies.findOne({ where: { id: req.params.id } });
    console.log("company", company);
    const companyDetails = JSON.parse(JSON.stringify(company));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!company) {
        res.status(500).json({ message: "Invalid Company" });
        return;
    }
    res.json({ message: "Company Details", data: companyDetails });

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

companyRouter.delete('/:id', auth, async (req, res) => {
    initializeCompanyModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const company = await Companies.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!company) {
        res.status(500).json({ message: "Invalid Company" });
        return;
    }

    try {
     await Companies.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Company Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Company" });
            return;
      }

});


companyRouter.post('/create', async (req, res) => {
    initializeCompanyModel(getSequelize());
    try {
        const {
            id,
            user_id,
            company_name,
            position,
            company_start_period,
            company_end_period,
            company_location                    
        } = req.body;
        console.log("req.body", req.body);

        let company: Companies | null;
       
        if (id) {
            const company = await Companies.update(
                {
                    user_id,
                    company_name,
                    position,
                    company_start_period,
                    company_end_period,
                    company_location                 
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Company Updated", data: company });
        } else {
                               

                    const company = await Companies.create({
                        user_id,
                        company_name,
                        position,
                        company_start_period,
                        company_end_period,
                        company_location
                    });
                    res.json({ message: "Company Created", data: company });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});


companyRouter.post('/updateexperience', async (req, res) => {
    initializeCompanyModel(getSequelize());
    try {
        const {
            id,
            user_id,
            total_experience,
            workrole_id,
            industry_id,
            skill_id                     
        } = req.body;
        console.log("req.body", req.body);

        const user = await Users.update(
            {
                total_experience                
            },
            {
                where: { id: user_id }
            }
        );

        await UserIndustry.destroy({
            where: { user_id: user_id }
        });

        const industryNumbers = industry_id.map((mn:number) => {
            return { user_id: user_id, industry_id: mn };
        });
         
            
        const userindustry = await UserIndustry.bulkCreate(industryNumbers);

        await UserProfessionalskill.destroy({
            where: { user_id: user_id }
        });

        const skillNumbers = skill_id.map((mn:number) => {
            return { user_id: user_id, skill_id: mn };
        });        
            
        const userskill = await UserProfessionalskill.bulkCreate(skillNumbers);

        await UserWorkRole.destroy({
            where: { user_id: user_id }
        });

        const roleNumbers = workrole_id.map((mn:number) => {
            return { user_id: user_id, workrole_id: mn };
        });        
            
        const usersworkrole = await UserWorkRole.bulkCreate(roleNumbers);

                    
                    res.json({ message: "Experience Updated Successfully", data: user });

                
       
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});



export default companyRouter;
