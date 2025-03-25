import express from 'express';
import Testimonials, { initializeTestimonialModel } from '../models/Testimonial';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import Users, { initializeUserModel } from '../models/User';
import { Op,WhereOptions } from 'sequelize';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const testimonialRouter = express.Router();

testimonialRouter.get('/', async (req, res) => {
    initializeTestimonialModel(getSequelize());
    initializeUserModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;

    Users.hasMany(Testimonials, { foreignKey: "user_id" });
	Testimonials.belongsTo(Users, { foreignKey: "user_id", targetKey: "id" });

    let whereCondition: WhereOptions<any> = {};
    let pageNumber;
    let pageSize;
    let offset;

    if (institute_id>0) {
       
        
        whereCondition.institute_id = institute_id as string;
       
    }

    if(req.query.hasOwnProperty('page_number')){
        pageNumber = req.query.page_number; // Page number
    } else{
        pageNumber = 1;
    }

    if(req.query.hasOwnProperty('page_size')){
        pageSize = req.query.page_size; // Page size
    } else{
        pageSize = 10; // Page size
    }

    offset = (Number(pageNumber) - 1) * Number(pageSize)

    const testimonial = await Testimonials.findAll({
        include: [
			{
				model: Users,
				required: true,
				attributes: ["first_name","last_name","professional_headline","image"],
			},			
		],
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize)
    });
    res.status(200).json({ total_records: 10, data: testimonial });

});


testimonialRouter.get('/:id', auth, async (req, res) => {
    initializeTestimonialModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const instituteId = (req as any).instituteId;
    const testimonial = await Testimonials.findOne({ where: { id: req.params.id, institute_id: instituteId} });
    console.log("testimonial", testimonial);
    const testimonialDetails = JSON.parse(JSON.stringify(testimonial));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!testimonial) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }
    res.json({ message: "Testimonial Details", data: testimonialDetails });

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

testimonialRouter.delete('/:id', auth, async (req, res) => {
    initializeTestimonialModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const institute_id = (req as any).instituteId;
    const testimonial = await Testimonials.findOne({ where: { id: req.params.id, institute_id: institute_id} });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!testimonial) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }

    try {
     await Testimonials.destroy({
            where: { id: req.params.id, institute_id: institute_id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Testimonial Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Testimonial" });
            return;
      }

});

testimonialRouter.get('/status/:id', auth, async (req, res) => {
    initializeTestimonialModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const testimonial = await Testimonials.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!testimonial) {
        res.status(500).json({ message: "Invalid Testimonial" });
        return;
    }

    try {

        if(testimonial.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const testimonialnew = await Testimonials.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Testimonial Updated", data: testimonialnew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Testimonial" });
            return;
      }

});

testimonialRouter.post('/create', async (req, res) => {
    initializeTestimonialModel(getSequelize());
    try {
        const {
            id,
            story_description,            
            user_id,
            status                     
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let testimonial: Testimonials | null;
        

        if (id) {
            const testimonial = await Testimonials.update(
                {
                    story_description,            
                    user_id,
                    status                  
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Testimonial Updated", data: testimonial });
        } else {
                               

                    const testimonial = await Testimonials.create({
                        institute_id,
                        story_description,            
                        user_id,
                        status                        
                    });
                    res.json({ message: "Testimonial Created", data: testimonial });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default testimonialRouter;
