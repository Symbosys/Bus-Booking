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
exports.updateBus = exports.getBusById = exports.getAllBuses = exports.createBus = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const types_1 = require("../types/types");
const response_util_1 = require("../utils/response.util");
const Bus_1 = require("../zod/Bus");
exports.createBus = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate input
    const validData = Bus_1.BusSchema.parse(req.body);
    // Perform operations in a transaction
    const bus = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if vendor exists
        const vendor = yield tx.vendor.findUnique({
            where: { id: validData.vendorId },
        });
        if (!vendor) {
            return next(new response_util_1.ErrorResponse("Vendor not found", types_1.statusCode.Bad_Request));
        }
        // Check if bus number is unique
        const existingBus = yield tx.bus.findUnique({
            where: { number: validData.number },
        });
        if (existingBus) {
            return next(new response_util_1.ErrorResponse("Bus number already exists", types_1.statusCode.Bad_Request));
        }
        // Create bus
        return yield tx.bus.create({
            data: validData,
            include: {
                vendor: {
                    select: { id: true, name: true, number: true },
                },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Bus created successfully", bus, types_1.statusCode.Created);
}));
exports.getAllBuses = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const vendorId = req.query.vendorId ? String(req.query.vendorId) : undefined;
    const isActive = req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;
    // Build where clause
    const where = {};
    if (searchQuery) {
        where.OR = [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { number: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
        ];
    }
    if (isActive !== undefined)
        where.isActive = isActive;
    if (vendorId)
        where.vendorId = vendorId;
    const [buses, totalBuses] = yield Promise.all([
        prisma_1.default.bus.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                vendor: {
                    select: { id: true, name: true, number: true },
                },
            },
        }),
        prisma_1.default.bus.count({ where }),
    ]);
    // if (page > Math.ceil(totalBuses / limit) && totalBuses > 0) {
    //   return next(new ErrorResponse("Page not found", statusCode.Not_Found));
    // }
    return (0, response_util_1.SuccessResponse)(res, "Buses retrieved successfully", {
        buses,
        currentPage: page,
        totalPages: Math.ceil(totalBuses / limit),
        totalBuses,
        count: buses.length
    });
}));
exports.getBusById = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Bus id is required", types_1.statusCode.Bad_Request));
    }
    const bus = yield prisma_1.default.bus.findUnique({
        where: { id },
    });
    return (0, response_util_1.SuccessResponse)(res, "Bus retrieved successfully", bus, types_1.statusCode.OK);
}));
exports.updateBus = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validData = Bus_1.BusSchema.partial().parse(req.body);
    if (!id) {
        return next(new response_util_1.ErrorResponse("Bus id is required", types_1.statusCode.Bad_Request));
    }
    const bus = yield prisma_1.default.bus.update({
        where: { id },
        data: validData,
    });
    return (0, response_util_1.SuccessResponse)(res, "Bus updated successfully", bus, types_1.statusCode.OK);
}));
