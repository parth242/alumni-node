import express from 'express';
import Events, { initializeEventModel } from '../models/Event';
import { getSequelize } from '../config/db';
import Users from '../models/User';
import { catchError } from '../common/functions';
import { auth } from '../middleware/auth';
import { Op, WhereOptions, Sequelize } from 'sequelize';
import multer from 'multer';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const directory = 'event';

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


const eventRouter = express.Router();

eventRouter.get('/', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    console.log("req", req.body);
    const institute_id = (req as any).instituteId;
    /*Events.hasMany(Users, {foreignKey: 'id'});
    Users.belongsTo(Events, {foreignKey: 'id', targetKey: 'user_id'});
    const role = await Events.findOne({ 
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
   

    if (req.query.hasOwnProperty('filter_category')) {
        if(req.query.filter_category!=''){
        const filterCategoryArray = (req.query.filter_category as string).split(',');
        if (filterCategoryArray.length > 0) {
        whereCondition.event_category = { [Op.in]: filterCategoryArray };
        }
        }
    }
   
    if(req.query.hasOwnProperty('filter_date')){
        if(req.query.filter_date!=''){
            const filterDate = req.query.filter_date as string;

            const currentDate = new Date();

            // Get the start and end of the current day (for 'Present' condition)
            const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
            const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

            if(filterDate=='Future'){               
                if (!isNaN(currentDate.getTime())) {
                whereCondition.event_date = { [Op.gt]: currentDate };
                }
            } else if (filterDate === 'Past') {
                if (!isNaN(startOfToday.getTime())) {
                whereCondition.event_date = { [Op.lt]: startOfToday };
                }
        } 
        else if (filterDate === 'Present') {
            // Filter present events (event_date is today)
            if (!isNaN(startOfToday.getTime()) && !isNaN(endOfToday.getTime())) {
            whereCondition.event_date = { [Op.gte]: startOfToday, // Greater than or equal to the start of today
            [Op.lte]: endOfToday    // Less than or equal to the end of today };
            }
        };
            
            }
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

    
    const event = await Events.findAll({
         
    where: whereCondition,
    order: [['id', 'DESC']],
    offset: offset, // Set the offset
    limit: Number(pageSize) // Set the limit to the page size
      });
      

    const totalcount = await Events.count({        
      where: whereCondition
    });

    res.status(200).json({ total_records: totalcount, data: event });

});


eventRouter.get('/:id', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    console.log("req.params.id", req.params.id);
       const event = await Events.findOne({ 
        
        where: { id: req.params.id } });
   


if (!event) {
    res.status(500).json({ message: "Invalid Event" });
    return;
} else{
    const eventdate = new Date(event.event_date);
    const formattedDate = eventdate.toISOString().split('T')[0];
    const formattedEventDetail = {
        id: event.id,
        event_title: event.event_title,
        event_date: formattedDate,
        event_time: event.event_time,
        createdAt: event.created_on,
        event_type: event.event_type,
        event_category: event.event_category,
        location: event.location,
        description: event.description,
        event_image: event.event_image,
        user_id: event.user_id,
        join_members: event.join_members,
        maybe_members: event.maybe_members,
        decline_members: event.decline_members,
        updatedAt: event.updated_on
        
    };


 
const eventDetails = JSON.parse(JSON.stringify(formattedEventDetail));
res.json({ message: "Event Details", data: eventDetails });
}


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

eventRouter.delete('/:id', auth, async (req, res) => {
    initializeEventModel(getSequelize());
    console.log("req.params.id", req.params.id);
    
    const event = await Events.findOne({ where: { id: req.params.id } });
   
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!event) {
        res.status(500).json({ message: "Invalid Event" });
        return;
    }

    try {
     await Events.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Event Successfully',
        });
    }catch (err) {
        res.status(500).json({ message: "Invalid Event" });
            return;
      }

});

eventRouter.post('/create', auth, async (req, res) => {
    initializeEventModel(getSequelize());
   
    try {
        const {
            id,
            event_title,
            event_date,
            event_type,
            event_category,
            event_image,
            location,
            description,            
            user_id,
            group_id                   
        } = req.body;

        const institute_id = (req as any).instituteId;
        console.log("req.body", req.body);

        let event: Events | null;
        
        
        if (id) {
            const event = await Events.update(
                {
                    institute_id,
                    event_title,
                    event_date,
                    event_type,
                    event_category,
                    location,
                    description,
                    event_image,
                    user_id,
                    group_id                
                },
                {
                    where: { id: id }
                }
            );

            

            

            res.json({ message: "Event Updated", data: event });
        } else {
                               

                    const event = await Events.create({
                        institute_id,
                        event_title,
                        event_date,
                        event_type,
                        event_category,
                        location,
                        description,
                        event_image,
                        user_id,
                        group_id
                    });
                    
                    res.json({ message: "Event Created", data: event });
                
        }
    } catch (error) {
        res.status(500).json({ message: catchError(error) });
    }
});

eventRouter.post("/updatejoinmaybeUser", auth, async (req, res) => {
	initializeEventModel(getSequelize());
	try {
		const {
			id,
			join_members,
			maybe_members,
			decline_members,			
		} = req.body;

		const event = await Events.update(
			{
				join_members,
			    maybe_members,
			    decline_members,
			},
			{
				where: { id: id },
			},
		);
		res.json({ message: "User Updated", data: event });
	} catch (error) {
		res.status(500).json({ message: catchError(error) });
	}
});




export default eventRouter;
