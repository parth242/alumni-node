import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function auth(req: Request, res: Response, next: NextFunction) {
    // Check for authentication, e.g., by looking for an authentication token in the request headers
    const authToken = req.cookies.token;
    if (!authToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return true;
    }

    const token: string = authToken;
    try {
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        jwt.verify(token, process.env.JWT_KEY || "", (err, decoded) => {
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
    } catch (err) {
        console.log("err", err);
        return res.status(401).json({
            status: "ERROR",
            message: "Unauthorized",
            data: [],
            error: []
        });
    }
}