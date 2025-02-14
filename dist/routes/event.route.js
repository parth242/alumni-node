"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Event_1 = __importStar(require("../models/Event"));
const db_1 = require("../config/db");
const functions_1 = require("../common/functions");
const auth_1 = require("../middleware/auth");
const sequelize_1 = require("sequelize");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const directory = 'event';
        const dir = 'dist/uploads/' + directory;
    },
    filename: function (req, file, cb) {
        const file_ext = file.originalname.split('.').pop();
        // var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
        // var file_name = crypto.createHash('md5').update(random_string).digest('hex');
        // var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
        const file_name = Date.now() + '_' + file.originalname.replace("." + file_ext, "").replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, '_');
        cb(null, file_name + '.' + file_ext); //Appending extension
    }
});
const upload = (0, multer_1.default)({
    storage: storage
});
// import CryptoJS from "crypto-js";
// const upload = multer({ dest: 'uploads/' })
const eventRouter = express_1.default.Router();
eventRouter.get('/', auth_1.auth, async (req, res) => {
    (0, Event_1.initializeEventModel)((0, db_1.getSequelize)());
    console.log("req", req.body);
    const institute_id = req.instituteId;
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
    let whereCondition = {};
    let pageNumber;
    let pageSize;
    let offset;
    if (institute_id > 0) {
        whereCondition.institute_id = institute_id;
    }
    if (req.query.hasOwnProperty('group_id')) {
        const group_id = Number(req.query.group_id);
        if (group_id > 0) {
            whereCondition.group_id = sequelize_1.Sequelize.literal(`JSON_CONTAINS(group_id, '[${group_id}]')`);
        }
    }
    if (req.query.hasOwnProperty('filter_category')) {
        if (req.query.filter_category != '') {
            const filterCategoryArray = req.query.filter_category.split(',');
            if (filterCategoryArray.length > 0) {
                whereCondition.event_category = { [sequelize_1.Op.in]: filterCategoryArray };
            }
        }
    }
    if (req.query.hasOwnProperty('filter_date')) {
        if (req.query.filter_date != '') {
            const filterDate = req.query.filter_date;
            const currentDate = new Date();
            // Get the start and end of the current day (for 'Present' condition)
            const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
            const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));
            if (filterDate == 'Future') {
                if (!isNaN(currentDate.getTime())) {
                    whereCondition.event_date = { [sequelize_1.Op.gt]: currentDate };
                }
            }
            else if (filterDate === 'Past') {
                if (!isNaN(startOfToday.getTime())) {
                    whereCondition.event_date = { [sequelize_1.Op.lt]: startOfToday };
                }
            }
            else if (filterDate === 'Present') {
                // Filter present events (event_date is today)
                if (!isNaN(startOfToday.getTime()) && !isNaN(endOfToday.getTime())) {
                    whereCondition.event_date = { [sequelize_1.Op.gte]: startOfToday, // Greater than or equal to the start of today
                        [sequelize_1.Op.lte]: endOfToday // Less than or equal to the end of today };
                    };
                }
                ;
            }
        }
    }
    if (req.query.hasOwnProperty('page_number')) {
        pageNumber = req.query.page_number; // Page number
    }
    else {
        pageNumber = 1;
    }
    if (req.query.hasOwnProperty('page_size')) {
        pageSize = req.query.page_size; // Page size
    }
    else {
        pageSize = 10; // Page size
    }
    offset = (Number(pageNumber) - 1) * Number(pageSize); // Calculate offset based on page number and page size
    const event = await Event_1.default.findAll({
        where: whereCondition,
        order: [['id', 'DESC']],
        offset: offset, // Set the offset
        limit: Number(pageSize) // Set the limit to the page size
    });
    const totalcount = await Event_1.default.count({
        where: whereCondition
    });
    res.status(200).json({ total_records: totalcount, data: event });
});
eventRouter.get('/:id', auth_1.auth, async (req, res) => {
    (0, Event_1.initializeEventModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const event = await Event_1.default.findOne({
        where: { id: req.params.id }
    });
    if (!event) {
        res.status(500).json({ message: "Invalid Event" });
        return;
    }
    else {
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
eventRouter.delete('/:id', auth_1.auth, async (req, res) => {
    (0, Event_1.initializeEventModel)((0, db_1.getSequelize)());
    console.log("req.params.id", req.params.id);
    const event = await Event_1.default.findOne({ where: { id: req.params.id } });
    // const user1 = await sequelize.query("SELECT * FROM users WHERE email=" + email);
    if (!event) {
        res.status(500).json({ message: "Invalid Event" });
        return;
    }
    try {
        await Event_1.default.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({
            status: 'success',
            message: 'Delete Event Successfully',
        });
    }
    catch (err) {
        res.status(500).json({ message: "Invalid Event" });
        return;
    }
});
eventRouter.post('/create', auth_1.auth, async (req, res) => {
    (0, Event_1.initializeEventModel)((0, db_1.getSequelize)());
    try {
        const { id, event_title, event_date, event_type, event_category, event_image, location, description, user_id, group_id } = req.body;
        const institute_id = req.instituteId;
        console.log("req.body", req.body);
        let event;
        if (id) {
            const event = await Event_1.default.update({
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
            }, {
                where: { id: id }
            });
            res.json({ message: "Event Updated", data: event });
        }
        else {
            const event = await Event_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
eventRouter.post("/updatejoinmaybeUser", auth_1.auth, async (req, res) => {
    (0, Event_1.initializeEventModel)((0, db_1.getSequelize)());
    try {
        const { id, join_members, maybe_members, decline_members, } = req.body;
        const event = await Event_1.default.update({
            join_members,
            maybe_members,
            decline_members,
        }, {
            where: { id: id },
        });
        res.json({ message: "User Updated", data: event });
    }
    catch (error) {
        res.status(500).json({ message: (0, functions_1.catchError)(error) });
    }
});
exports.default = eventRouter;
//# sourceMappingURL=event.route.js.map