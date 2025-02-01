"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_1 = __importDefault(require("./swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const sequelize_1 = require("sequelize"); // Import QueryTypes
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
/* Start for CORS */
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://alumni-react.onrender.com",
        
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (e.g., cookies) for cross-origin requests
}));
app.use(cors({
    origin: 'https://alumni-react.onrender.com', // Allow only your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(async (req, res, next) => {
    const siteUrl = req.headers.host;
    try {
        console.log("fetching host url", siteUrl);
        const rows = await db_1.configDb.query("SELECT * FROM institute_sitedetails WHERE institute_siteurl = ?", {
            replacements: [siteUrl],
            type: sequelize_1.QueryTypes.SELECT,
        });
        console.log("rowdata", rows[0]);
        if (rows && rows.length > 0) {
            const { site_dbhost, site_dbuser, site_dbpassword, site_dbname, id, } = rows[0];
            // Store `institute_id` in a cookie (for future requests)
            res.cookie("institute_id", id);
            // Attach `institute_id` to `req` for immediate use
            req.instituteId = id;
            // Set up the site-specific database instance
            await (0, db_1.initializeSequelize)({
                host: site_dbhost,
                username: site_dbuser,
                password: site_dbpassword,
                database: site_dbname,
            });
            next();
        }
        else {
            res.status(404).send("Site not found");
        }
    }
    catch (err) {
        console.error(`Error in middleware: ${err.message}`);
        next(err);
    }
});
// Ensure models are available for each request after database initialization
/*
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}

app.use(cors(corsOptions));
app.use((req, res, next) => {
    console.log("req", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    if (req.headers.origin) {
        const domain = req.headers.origin.replace('http://', '').replace('https://', '').replace('www.', '');
        console.log("domain", domain);
        if (domain == 'localhost:3000' || domain == 'shikshakportal.com' || domain == 'dev.shikshakportal.com') {
            req.headers.domain = 'shikshak';
        } else {
            req.headers.domain = 'shishya';
        }
    }
    next();
}); */
/* End for CORS */
const user_route_1 = __importDefault(require("./routes/user.route"));
const department_route_1 = __importDefault(require("./routes/department.route"));
const role_route_1 = __importDefault(require("./routes/role.route"));
const country_route_1 = __importDefault(require("./routes/country.route"));
const state_route_1 = __importDefault(require("./routes/state.route"));
const submenu_route_1 = __importDefault(require("./routes/submenu.route"));
const event_route_1 = __importDefault(require("./routes/event.route"));
const industry_route_1 = __importDefault(require("./routes/industry.route"));
const professionalskill_route_1 = __importDefault(require("./routes/professionalskill.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const education_route_1 = __importDefault(require("./routes/education.route"));
const workrole_route_1 = __importDefault(require("./routes/workrole.route"));
const company_route_1 = __importDefault(require("./routes/company.route"));
const resumeattachment_route_1 = __importDefault(require("./routes/resumeattachment.route"));
const news_route_1 = __importDefault(require("./routes/news.route"));
const job_route_1 = __importDefault(require("./routes/job.route"));
const professionalarea_route_1 = __importDefault(require("./routes/professionalarea.route"));
const feed_route_1 = __importDefault(require("./routes/feed.route"));
const slideshow_route_1 = __importDefault(require("./routes/slideshow.route"));
const setting_route_1 = __importDefault(require("./routes/setting.route"));
const businessdirectory_route_1 = __importDefault(require("./routes/businessdirectory.route"));
const group_route_1 = __importDefault(require("./routes/group.route"));
const services_route_1 = __importDefault(require("./routes/services.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
console.log("express.static(__dirname + '/uploads')", __dirname, express_1.default.static(__dirname + "/uploads"));
app.use("/upload", express_1.default.static(__dirname + "/uploads")); //Todo Serve content files
// Serve the Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use(async (req, res, next) => {
    // Retrieve site-specific database details and `institute_id`
    req.instituteId =
        req.cookies.institute_id || req.instituteId; // Fallback to the middleware-set value
    // Continue with the middleware logic
    next();
});
app.get("/", (req, res) => {
    res.send("Welcome to Alumni");
});
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/department", department_route_1.default);
app.use("/api/v1/role", role_route_1.default);
app.use("/api/v1/country", country_route_1.default);
app.use("/api/v1/state", state_route_1.default);
app.use("/api/v1/submenu", submenu_route_1.default);
app.use("/api/v1/event", event_route_1.default);
app.use("/api/v1/industry", industry_route_1.default);
app.use("/api/v1/professionalskill", professionalskill_route_1.default);
app.use("/api/v1/professionalarea", professionalarea_route_1.default);
app.use("/api/v1/course", course_route_1.default);
app.use("/api/v1/education", education_route_1.default);
app.use("/api/v1/workrole", workrole_route_1.default);
app.use("/api/v1/company", company_route_1.default);
app.use("/api/v1/resume", resumeattachment_route_1.default);
app.use("/api/v1/news", news_route_1.default);
app.use("/api/v1/job", job_route_1.default);
app.use("/api/v1/feed", feed_route_1.default);
app.use("/api/v1/slideshow", slideshow_route_1.default);
app.use("/api/v1/setting", setting_route_1.default);
app.use("/api/v1/services", services_route_1.default);
app.use("/api/v1/products", products_route_1.default);
app.use("/api/v1/businessdirectory", businessdirectory_route_1.default);
app.use("/api/v1/group", group_route_1.default);
app.use("/api/v1/category", category_route_1.default);
// Wildcard route to catch all other requests
app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map