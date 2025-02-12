import express from 'express';
import Slideshows, { initializeSlideshowModel } from '../models/Slideshow';
import { getSequelize } from '../config/db';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const directory = 'slideshow';

        const dir = 'dist/uploads/' + directory;
    },
    filename: function (req, file, cb) {
        const file_ext = file.originalname.split('.').pop();
        // var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
        // var file_name = crypto.createHash('md5').update(random_string).digest('hex');
        // var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
        const file_name = Date.now()+'_'+file.originalname.replace("." + file_ext, "").replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, '_');
        cb(null, file_name + '.' + file_ext) //Appending extension
    }
});

const upload = multer({
    storage: storage
    
    
});
// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const slideshowRouter = express.Router();

slideshowRouter.get('/', async (req, res) => {
    initializeSlideshowModel(getSequelize());
    console.log("req", req.body);
    const slideshow = await Slideshows.findAll();
    res.status(200).json({ total_records: 10, data: slideshow });

});


slideshowRouter.get('/:id', auth, async (req, res) => {
    initializeSlideshowModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const slideshow = await Slideshows.findOne({ where: { id: req.params.id } });
    console.log("slideshow", slideshow);
    const slideshowDetails = JSON.parse(JSON.stringify(slideshow));
    // Second method to get data
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!slideshow) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }
    res.json({ message: "Slideshow Details", data: slideshowDetails });

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

slideshowRouter.delete('/:id', auth, async (req, res) => {
    initializeSlideshowModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const slideshow = await Slideshows.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!slideshow) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }

    try {
     await Slideshows.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Slideshow Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Slideshow" });
            return;
      }

});

slideshowRouter.get('/status/:id', auth, async (req, res) => {
    initializeSlideshowModel(getSequelize());
    console.log("req.params.id", req.params.id);
    const slideshow = await Slideshows.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!slideshow) {
        res.status(500).json({ message: "Invalid Slideshow" });
        return;
    }

    try {

        if(slideshow.status=='active'){
            var status = 'inactive';
        } else{
            var status = 'active';
        }

        const slideshownew = await Slideshows.update(
            {
                status           
            },
            {
                where: { id: req.params.id }
            }
        );
        res.json({ message: "Slideshow Updated", data: slideshownew });
        
    }catch (err) {
        res.status(500).json({ message: "Invalid Slideshow" });
            return;
      }

});

slideshowRouter.post('/create', async (req, res) => {
    initializeSlideshowModel(getSequelize());
    try {
        const {
            id,
            slide_title,
            slide_image,
            status                     
        } = req.body;
        console.log("req.body", req.body);
        const institute_id = (req as any).instituteId;

        let slideshow: Slideshows | null;
        if (id) {
            slideshow = await Slideshows.findOne({ where: { slide_title: slide_title, institute_id: institute_id, id: { $not: id } } });
            console.log("user>>>>>>>>>>>>>>>>", slideshow);
        } else {
            slideshow = await Slideshows.findOne({ where: { slide_title: slide_title, institute_id: institute_id } });
        }
        if (slideshow) {
            res.status(500).json({ message: "Slideshow already exist." });
            return;
        }

        if (id) {
            const slideshow = await Slideshows.update(
                {
                    slide_title,
                    slide_image,
                    status                 
                },
                {
                    where: { id: id }
                }
            );
            res.json({ message: "Slideshow Updated", data: slideshow });
        } else {
                               

                    const slideshow = await Slideshows.create({
                        institute_id,
                        slide_title,
                        slide_image,
                        status
                    });
                    res.json({ message: "Slideshow Created", data: slideshow });

                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default slideshowRouter;
