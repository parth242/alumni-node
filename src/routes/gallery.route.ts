import express from 'express';
import Gallery, { initializeGalleryModel } from '../models/Gallery';
import { getSequelize } from '../config/db';
import Users from '../models/User';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { Op,WhereOptions,Sequelize } from 'sequelize';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const galleryRouter = express.Router();

galleryRouter.get('/', async (req, res) => {
    initializeGalleryModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;
   
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
    

    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size

    
    const gallery = await Gallery.findAll({
         
    where: whereCondition,
    order: [['id', 'DESC']],
    offset: offset, // Set the offset
    limit: Number(pageSize) // Set the limit to the page size
      });
      
    const totalcount = await Gallery.count({        
      where: whereCondition
    });

    const totalData = await Gallery.findAll();

    res.status(200).json({ total_records: totalcount, data: gallery, total_data: totalData });

});


galleryRouter.get('/:id', auth, async (req, res) => {
    initializeGalleryModel(getSequelize());
    console.log("req.params.id", req.params.id);
       const gallery = await Gallery.findOne({ 
        
        where: { id: req.params.id } });
   


if (!gallery) {
    res.status(500).json({ message: "Invalid Gallery" });
    return;
}
const galleryDetails = JSON.parse(JSON.stringify(gallery));
res.json({ message: "Gallery Details", data: galleryDetails });

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

galleryRouter.delete('/:id', auth, async (req, res) => {
    initializeGalleryModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const gallery = await Gallery.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!gallery) {
        res.status(500).json({ message: "Invalid Gallery" });
        return;
    }

    try {
     await Gallery.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Gallery Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Gallery" });
            return;
      }

});

galleryRouter.post('/create', async (req, res) => {
    initializeGalleryModel(getSequelize());
    try {
        const {
            id,
            gallery_image                         
        } = req.body;

        const institute_id = (req as any).instituteId;

        console.log("req.body", req.body);

        let gallery: Gallery | null;
        
        
        if (id) {
            const gallery = await Gallery.update(
                {
                    institute_id,
                    gallery_image                                
                },
                {
                    where: { id: id }
                }
            );

         

            res.json({ message: "Gallery Updated", data: gallery });
        } else {
                               

                    const gallery = await Gallery.create({
                        institute_id,
                        gallery_image                        
                    });
                    
                    res.json({ message: "Gallery Created", data: gallery });
                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default galleryRouter;
