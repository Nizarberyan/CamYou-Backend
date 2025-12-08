import { object, string, date, mixed } from "yup";

export const createDriverSchema = object({
  body: object({
    name: string().required("Name is required"),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    licenseNumber: string().required("License number is required"),
    licenseExpiry: date().required("License expiry date is required"),
    status: mixed().oneOf(["active", "inactive", "on_trip"]).default("active"),
  }),
});
