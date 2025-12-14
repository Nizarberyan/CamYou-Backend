import { test, expect, describe, mock, beforeAll, afterAll } from "bun:test";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/blacklistedToken.model";

// Mock the BlacklistedToken model
mock.module("../models/blacklistedToken.model", () => ({
  default: {
    findOne: mock(),
  },
}));

describe("Auth Middleware", () => {
  test("should block request without token", async () => {
    const req = {
      header: () => undefined,
    } as unknown as Request;
    const res = {
      status: mock(() => res),
      json: mock(() => res),
    } as unknown as Response;
    const next = mock(() => { }) as NextFunction;

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should block request with invalid token", async () => {
    const req = {
      header: () => "Bearer invalidtoken",
    } as unknown as Request;
    const res = {
      status: mock(() => res),
      json: mock(() => res),
    } as unknown as Response;
    const next = mock(() => { }) as NextFunction;

    // Mock findOne to return null (token not blacklisted, but verify fails)
    (BlacklistedToken.findOne as any).mockResolvedValue(null);

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should allow request with valid token", async () => {
    const secret = process.env.JWT_SECRET || "secret";
    const validToken = jwt.sign({ id: "123", role: "user" }, secret);
    const req = {
      header: () => `Bearer ${validToken}`,
    } as unknown as Request;
    const res = {
      status: mock(() => res),
      json: mock(() => res),
    } as unknown as Response;
    const next = mock(() => { }) as NextFunction;

    // Mock findOne to return null
    (BlacklistedToken.findOne as any).mockResolvedValue(null);

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual(expect.objectContaining({ id: "123" }));
  });
});
