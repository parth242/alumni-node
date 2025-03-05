import express from 'express';
import News, { initializeNewsModel } from '../models/News';
import { getSequelize } from '../config/db';
import Users from '../models/User';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { Op,WhereOptions,Sequelize } from 'sequelize';


// import CryptoJS from "crypto-js";

// const upload = multer({ dest: 'uploads/' })


const newsRouter = express.Router();

newsRouter.get('/', auth, async (req, res) => {
    initializeNewsModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;
    /*News.hasMany(Users, {foreignKey: 'id'});
    Users.belongsTo(News, {foreignKey: 'id', targetKey: 'user_id'});
    const role = await News.findOne({ 
        include: [{
            model: Users,
            required: true,
            attributes: ['first_name'],
            separate: true,
          }
      ],
         });*/
    
    
            
    let whereCondition: WhereOptions<any> = {};
    let pageNumber;
    let pageSize;
    let offset;

    if (institute_id>0) {
       
        
        whereCondition.institute_id = institute_id as string;
       
    }
    
    if (req.query.hasOwnProperty('group_id')) {
        const group_id = Number(req.query.group_id);

        if (group_id > 0) {
            whereCondition.group_id = Sequelize.literal(`JSON_CONTAINS(group_id, '[${group_id}]')`);
        }     
        
        
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

    
    const news = await News.findAll({
         
    where: whereCondition,
    order: [['id', 'DESC']],
    offset: offset, // Set the offset
    limit: Number(pageSize) // Set the limit to the page size
      });
      
    const totalcount = await News.count({        
      where: whereCondition
    });

    const totalData = await News.findAll();

    res.status(200).json({ total_records: totalcount, data: news, total_data: totalData });

});


newsRouter.get('/:id', auth, async (req, res) => {
    initializeNewsModel(getSequelize());
    console.log("req.params.id", req.params.id);
       const news = await News.findOne({ 
        
        where: { id: req.params.id } });
   


if (!news) {
    res.status(500).json({ message: "Invalid News" });
    return;
}
const newsDetails = JSON.parse(JSON.stringify(news));
res.json({ message: "News Details", data: newsDetails });

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

newsRouter.delete('/:id', auth, async (req, res) => {
    initializeNewsModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const news = await News.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!news) {
        res.status(500).json({ message: "Invalid News" });
        return;
    }

    try {
     await News.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete News Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid News" });
            return;
      }

});

newsRouter.post('/create', async (req, res) => {
    initializeNewsModel(getSequelize());
    try {
        const {
            id,
            title,
            posted_date,
            description,
            news_url,
            status,
            user_id,
            group_id                
        } = req.body;

        const institute_id = (req as any).instituteId;

        console.log("req.body", req.body);

        let news: News | null;
        
        
        if (id) {
            const news = await News.update(
                {
                    institute_id,
                    title,
                    posted_date,
                    description,
                    news_url,
                    status,
                    user_id,
                    group_id                 
                },
                {
                    where: { id: id }
                }
            );

            

            

            res.json({ message: "News Updated", data: news });
        } else {
                               

                    const news = await News.create({
                        institute_id,
                        title,
                        posted_date,                       
                        description,
                        news_url,
                        status,
                        user_id,
                        group_id
                    });
                    
                    res.json({ message: "News Created", data: news });
                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});






export default newsRouter;
