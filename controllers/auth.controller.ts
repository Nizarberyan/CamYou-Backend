import type { Request, Response } from "express";
const authController = {
    register: (req: Request, res: Response) => {
        res.json({ message: "Register", data: req.body });
    },
    login: (req: Request, res: Response) => {
        res.json({ message: "Login", data: req.body });
    },
};

export default authController;