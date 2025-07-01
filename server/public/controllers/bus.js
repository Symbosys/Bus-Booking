"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBus = createBus;
exports.getAllBuses = getAllBuses;
const Bus_1 = require("../zod/Bus");
const prisma_1 = __importDefault(require("../config/prisma"));
const response_util_1 = require("../utils/response.util");
function createBus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, number, acType, seaterType, deckType, time, isActive, vendorId } = req.body;
        // Validate input
        const validData = Bus_1.BusSchema.parse({
            name,
            number,
            acType,
            seaterType,
            deckType,
            time,
            isActive,
            vendorId,
        });
        // Check if vendor exists
        const vendor = yield prisma_1.default.vendor.findUnique({ where: { id: validData.vendorId } });
        if (!vendor) {
            return next(new response_util_1.ErrorResponse("Vendor not found", 400));
        }
        // Check if bus number is unique
        const existingBus = yield prisma_1.default.bus.findUnique({ where: { number: validData.number } });
        if (existingBus) {
            throw new Error("Bus number already exists");
        }
        // Create bus
        const bus = yield prisma_1.default.bus.create({
            data: validData,
            include: {
                vendor: {
                    select: { id: true, name: true, number: true },
                },
            },
        });
        res.status(201).json({
            message: "Bus created successfully",
            success: true,
            data: bus,
        });
    });
}
function getAllBuses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const buses = yield prisma_1.default.bus.findMany({
            include: {
                vendor: {
                    select: { id: true, name: true, number: true },
                },
            },
        });
        res.status(200).json({
            message: "Buses retrieved successfully",
            success: true,
            data: buses,
        });
    });
}
