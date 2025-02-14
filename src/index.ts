import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import swaggerSpec from "./swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { configDb, initializeSequelize } from "./config/db";
import { QueryTypes } from "sequelize"; // Import QueryTypes
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

/* Start for CORS */
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
			"https://alumni-react.onrender.com",
		], // Replace with your client app's URL
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // Enable credentials (e.g., cookies) for cross-origin requests
	}),
);

app.use(async (req, res, next) => {
	const siteUrl = req.headers.host;

	try {


		let query = "SELECT * FROM institute_sitedetails WHERE ";
		let replacements: any[] = [];

		if(req.cookies.instituteId){
			query += "id = ?";
    		replacements.push(req.cookies.instituteId);
		}  else{
			query += "institute_siteurl = ?";
    		replacements.push(siteUrl);
		}

		   const rows: InstituteSiteDetails[] = await configDb.query(query,
			{
				replacements,
				type: QueryTypes.SELECT,
			},
		);


		//console.log("rowdata", rows[0]);

		if (rows && rows.length > 0) {
			const {
				site_dbhost,
				site_dbuser,
				site_dbpassword,
				site_dbname,
				institute_name,
				id,
			} = rows[0];

			// Store `institute_id` in a cookie (for future requests)
			res.cookie("institute_id", id, {
				httpOnly: true,
				secure: true,
				sameSite: 'none'  // Adjust based on your requirements
			});

			res.cookie("institute_name", institute_name, {
				httpOnly: true,
				secure: true,
				sameSite: 'none'  // Adjust based on your requirements
			});





			// Attach `institute_id` to `req` for immediate use
			(req as any).instituteId = id;

			// Set up the site-specific database instance
			await initializeSequelize({
				host: site_dbhost,
				username: site_dbuser,
				password: site_dbpassword,
				database: site_dbname,
			});

			next();
		} else {
			res.status(404).send("Site not found");
		}
	} catch (err) {
		console.error(`Error in middleware: ${(err as any).message}`);
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
import uploadRouter from "./routes/upload.route";

import userRouter from "./routes/user.route";
import departmentRouter from "./routes/department.route";
import roleRouter from "./routes/role.route";
import countryRouter from "./routes/country.route";
import stateRouter from "./routes/state.route";
import submenuRouter from "./routes/submenu.route";
import eventRouter from "./routes/event.route";
import industryRouter from "./routes/industry.route";
import professionalskillRouter from "./routes/professionalskill.route";
import courseRouter from "./routes/course.route";
import educationRouter from "./routes/education.route";
import workroleRouter from "./routes/workrole.route";

import companyRouter from "./routes/company.route";
import resumeattachmentRouter from "./routes/resumeattachment.route";
import newsRouter from "./routes/news.route";
import jobRouter from "./routes/job.route";
import professionalareaRouter from "./routes/professionalarea.route";
import feedRouter from "./routes/feed.route";
import slideshowRouter from "./routes/slideshow.route";
import settingRouter from "./routes/setting.route";
import businessdirectoryRouter from "./routes/businessdirectory.route";
import groupRouter from "./routes/group.route";
import InstituteSiteDetails from "./models/InstituteSiteDetails";
import servicesRouter from "./routes/services.route";
import productsRouter from "./routes/products.route";
import categoryRouter from "./routes/category.route";
import jobSkillsRouter from "./routes/skills.route";
import jobApplicationsRouter from "./routes/jobApplications.route";
import emailtemplateRouter from "./routes/emailtemplate.route";
import instituteRouter from "./routes/institute.route";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/upload", express.static(__dirname + "/uploads")); //Todo Serve content files

// Serve the Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(async (req, res, next) => {
	console.log("in am inside middleware");
	// Retrieve site-specific database details and `institute_id`
	(req as any).instituteId =
		req.cookies.institute_id || (req as any).instituteId; // Fallback to the middleware-set value
	// Continue with the middleware logic
	next();
});

app.get("/", (req, res) => {
	res.send("Welcome to Alumni");
});

app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/user", userRouter);

app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/country", countryRouter);
app.use("/api/v1/state", stateRouter);
app.use("/api/v1/submenu", submenuRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/industry", industryRouter);
app.use("/api/v1/professionalskill", professionalskillRouter);
app.use("/api/v1/professionalarea", professionalareaRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/education", educationRouter);
app.use("/api/v1/workrole", workroleRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/resume", resumeattachmentRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/feed", feedRouter);
app.use("/api/v1/slideshow", slideshowRouter);
app.use("/api/v1/setting", settingRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/jobskills", jobSkillsRouter);
app.use("/api/v1/jobapplication", jobApplicationsRouter);
app.use("/api/v1/businessdirectory", businessdirectoryRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/emailtemplate", emailtemplateRouter);
app.use("/api/v1/institute", instituteRouter);

// Wildcard route to catch all other requests
app.all("*", (req, res) => {
	res.status(404).send("Route not found");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});
export default app;
