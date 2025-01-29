"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    // Check for authentication, e.g., by looking for an authentication token in the request headers
    const authToken = req.cookies.token;
    if (!authToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return true;
    }
    const token = authToken;
    try {
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY || "", (err, decoded) => {
            console.log("err", err);
            if (err) {
                res.status(401).json({ error: 'Unauthorized' });
                return true;
            }
            // Store the decoded user ID for further use in the route
            req.body.sessionUser = decoded;
            // eslint-disable-next-line no-self-assign
            req.body.type = req.body.type;
            next();
        });
    }
    catch (err) {
        console.log("err", err);
        return res.status(401).json({
            status: "ERROR",
            message: "Unauthorized",
            data: [],
            error: []
        });
    }
}
exports.auth = auth;
//# sourceMappingURL=auth.js.map