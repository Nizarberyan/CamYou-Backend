import { object, string } from "yup";

export const createAdminSchema = object({
    body: object({
        name: string().required("Name is required"),
        email: string().email("Must be a valid email").required("Email is required"),
        password: string().min(6, "Password must be at least 6 characters long").required("Password is required"),
    }),
});
