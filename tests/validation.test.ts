import { describe, it, expect } from "bun:test";
import { createUserSchema } from "../validations/user.validation";
import { createDriverSchema } from "../validations/driver.validation";

describe("Validation Schemas", () => {
    it("should validate a valid user", async () => {
        const validUser = {
            body: {
                name: "Valid User",
                email: "test@example.com",
                password: "password123",
                role: "user"
            }
        };
        const result = await createUserSchema.isValid(validUser);
        expect(result).toBe(true);
    });

    it("should invalidate a user with invalid email", async () => {
        const invalidUser = {
            body: {
                name: "User",
                email: "not-an-email",
                password: "password123"
            }
        };
        const result = await createUserSchema.isValid(invalidUser);
        expect(result).toBe(false);
    });

    it("should validate a valid driver", async () => {
        const validDriver = {
            body: {
                name: "Driver",
                email: "driver@example.com",
                password: "password123",
                licenseNumber: "DL123",
                licenseExpiry: "2030-01-01"
            }
        };
        const result = await createDriverSchema.isValid(validDriver);
        expect(result).toBe(true);
    });
});
