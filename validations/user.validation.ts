import { object, string, mixed } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    role: mixed().oneOf(["user", "admin", "driver"]).default("user"),
    profileImage: string(),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: string().required("Password is required"),
  }),
});
