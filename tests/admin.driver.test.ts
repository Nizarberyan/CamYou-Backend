import { test, expect, describe, mock, spyOn, afterEach } from "bun:test";
import { Types } from "mongoose";
import driverController from "../controllers/driver.controller";
import DriverService from "../services/driver.service";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.model";

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = mock(() => res as Response);
  res.json = mock(() => res as Response);
  return res as Response;
};

describe("Driver Controller", () => {
  afterEach(() => {
    mock.restore();
  });

  test("createDriver should return 201 and created driver", async () => {
    const mockDriver: Partial<IUser> = {
      _id: new Types.ObjectId(),
      name: "Test Driver",
      email: "test@example.com",
      licenseNumber: "XYZ123",
      status: "active",
      role: "driver",
    };

    const createDriverSpy = spyOn(
      DriverService,
      "createDriver",
    ).mockResolvedValue(
      mockDriver as Awaited<ReturnType<typeof DriverService.createDriver>>,
    );

    const req: Partial<Request> = {
      body: {
        name: "Test Driver",
        email: "test@example.com",
        licenseNumber: "XYZ123",
        password: "password123",
        licenseExpiry: new Date(),
      },
    };
    const res = createMockResponse();

    await driverController.createDriver(req as Request, res);

    expect(createDriverSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockDriver);
  });

  test("getDrivers should return 200 and list of drivers", async () => {
    const mockDrivers: Partial<IUser>[] = [
      {
        _id: new Types.ObjectId(),
        name: "Test Driver",
        email: "test@example.com",
        licenseNumber: "XYZ123",
        status: "active",
        role: "driver",
      },
    ];

    const getDriversSpy = spyOn(DriverService, "getDrivers").mockResolvedValue(
      mockDrivers as Awaited<ReturnType<typeof DriverService.getDrivers>>,
    );

    const req: Partial<Request> = {};
    const res = createMockResponse();

    await driverController.getDrivers(req as Request, res);

    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDrivers);
  });

  test("getDriverById should return 200 and driver if found", async () => {
    const mockDriver: Partial<IUser> = {
      _id: new Types.ObjectId(),
      name: "Test Driver",
      email: "test@example.com",
      licenseNumber: "XYZ123",
      status: "active",
      role: "driver",
    };

    const getDriverByIdSpy = spyOn(
      DriverService,
      "getDriverById",
    ).mockResolvedValue(
      mockDriver as Awaited<ReturnType<typeof DriverService.getDriverById>>,
    );

    const req: Partial<Request> = { params: { id: "1" } };
    const res = createMockResponse();

    await driverController.getDriverById(req as Request<{ id: string }>, res);

    expect(getDriverByIdSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDriver);
  });

  test("deleteDriver should return 200 if deleted", async () => {
    const deleteDriverSpy = spyOn(
      DriverService,
      "deleteDriver",
    ).mockResolvedValue({ _id: new Types.ObjectId() } as Awaited<
      ReturnType<typeof DriverService.deleteDriver>
    >);

    const req: Partial<Request<{ id: string }>> = { params: { id: "1" } };
    const res = createMockResponse();

    await driverController.deleteDriver(req as Request<{ id: string }>, res);

    expect(deleteDriverSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Driver deleted successfully",
    });
  });
});
