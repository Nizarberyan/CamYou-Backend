import { test, expect, describe, mock } from "bun:test";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
  test("should block request without token", () => {
    const req = {
      header: () => undefined,
    } as unknown as Request;
    const res = {
      status: mock(() => res),
      json: mock(() => res),
    } as unknown as Response;
    const next = mock(() => {}) as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should block request with invalid token", () => {
    const req = {
      header: () => "Bearer invalidtoken",
    } as unknown as Request;
    const res = {
      status: mock(() => res),
      json: mock(() => res),
    } as unknown as Response;
    const next = mock(() => {}) as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should allow request with valid token", () => {
    const secret = process.env.JWT_SECRET || "secret";
    const validToken = jwt.sign({ id: "123" }, secret);
    const req = {
      header: () => `Bearer ${validToken}`,
    } as unknown as Request;
    const res = {
      status: mock(() => res),
      json: mock(() => res),
    } as unknown as Response;
    const next = mock(() => {}) as NextFunction;

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(expect.objectContaining({ id: "123" }));
  });
});
