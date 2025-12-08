import type { Request, Response, NextFunction } from "express";
import { Schema, ValidationError } from "yup";
import logger from "../config/logger";

const validate = (schema: Schema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, { abortEarly: false }); // Validate everything so we can report all errors
        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            const errors = error.inner.map((e) => ({
                path: e.path,
                message: e.message,
            }));
            logger.warn(`Validation Error: ${JSON.stringify(errors)}`);
            return res.status(400).json({ errors });
        }
        logger.error(`Unexpected validation error: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default validate;
