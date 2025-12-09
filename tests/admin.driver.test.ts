import { test, expect, describe, mock, spyOn, afterEach } from "bun:test";
import driverController from "../controllers/driver.controller";
import DriverService from "../services/driver.service";
import type { Request, Response } from "express";
import type { IDriver } from "../models/Driver.model";
import type { ObjectId } from "mongoose";

const createMockResponse = () => {
    const res: Partial<Response> = {};
    res.status = mock(() => res as Response);
    res.json = mock(() => res as Response);
    return res as Response;
};
interface mockDriver {
    _id: ObjectId;
    name: string;
}
describe("Driver Controller", () => {
    afterEach(() => {
        mock.restore();
    });

    test("createDriver should return 201 and created driver", async () => {
        const mockDriver: mockDriver = { _id: "1" , name: "Test Driver" };
        const createDriverSpy = spyOn(DriverService, "createDriver").mockResolvedValue(mockDriver as any);

        const req: Partial<Request> = { body: { name: "Test Driver" } };
        const res = createMockResponse();

        await driverController.createDriver(req as Request, res);

        expect(createDriverSpy).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockDriver);
    });

    test("getDrivers should return 200 and list of drivers", async () => {
        const mockDrivers: mockDriver[] = [{ _id: "1" , name: "Test Driver" }];
        const getDriversSpy = spyOn(DriverService, "getDrivers").mockResolvedValue(mockDrivers as any);

        const req: Partial<Request> = {};
        const res = createMockResponse();

        await driverController.getDrivers(req as Request, res);

        expect(getDriversSpy).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockDrivers);
    });

    test("getDriverById should return 200 and driver if found", async () => {
        const mockDriver: mockDriver = { _id: "1" , name: "Test Driver" };
        const getDriverByIdSpy = spyOn(DriverService, "getDriverById").mockResolvedValue(mockDriver as any);

        const req: Partial<Request> = { params: { id: "1" } };
        const res = createMockResponse();

        await driverController.getDriverById(req as unknown as Request<{ id: string }>, res);

        expect(getDriverByIdSpy).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockDriver);
    });

    test("deleteDriver should return 200 if deleted", async () => {
        const deleteDriverSpy = spyOn(DriverService, "deleteDriver").mockResolvedValue({ _id: "1" } as  mockDriver);

        const req: Partial<Request<{ id: string }>> = { params: { id: "1" } };
        const res = createMockResponse();

        await driverController.deleteDriver(req as Request<{ id: string }>, res);

        expect(deleteDriverSpy).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Driver deleted successfully" });
    });
});

