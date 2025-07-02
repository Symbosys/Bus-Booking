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
exports.deleteBusStop = exports.updateBusStop = exports.createBusStop = exports.getBusStopById = exports.getAllBusStops = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const response_util_1 = require("../utils/response.util");
const types_1 = require("../types/types");
const Bus_1 = require("../zod/Bus");
exports.getAllBusStops = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const busId = req.query.busId ? String(req.query.busId) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;
    const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;
    // Build where clause
    const where = {};
    if (searchQuery) {
        where.OR = [
            { busStandName: { contains: searchQuery, mode: "insensitive" } },
        ];
    }
    if (busId)
        where.busId = busId;
    if (status) {
        where.status = { equals: status, mode: "insensitive" };
    }
    const [busStops, totalBusStops] = yield Promise.all([
        prisma_1.default.busStoppage.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                bus: { select: { id: true, name: true } },
            },
        }),
        prisma_1.default.busStoppage.count({ where }),
    ]);
    if (page > Math.ceil(totalBusStops / limit) && totalBusStops > 0) {
        return next(new response_util_1.ErrorResponse("Page not found", types_1.statusCode.Not_Found));
    }
    return (0, response_util_1.SuccessResponse)(res, "Bus stops retrieved successfully", {
        busStops,
        currentPage: page,
        totalPages: Math.ceil(totalBusStops / limit),
        totalBusStops,
        count: busStops.length,
        hasNextPage: page * limit < totalBusStops,
        hasPrevPage: page > 1,
    });
}));
exports.getBusStopById = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Bus stop ID is required", types_1.statusCode.Bad_Request));
    }
    const busStop = yield prisma_1.default.busStoppage.findUnique({
        where: { id },
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    if (!busStop) {
        return next(new response_util_1.ErrorResponse("Bus stop not found", types_1.statusCode.Not_Found));
    }
    return (0, response_util_1.SuccessResponse)(res, "Bus stop retrieved successfully", busStop, types_1.statusCode.OK);
}));
exports.createBusStop = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = Bus_1.BusStoppageSchema.parse(req.body);
    const busStop = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if bus exists
        const bus = yield tx.bus.findUnique({
            where: { id: validData.busId },
        });
        if (!bus) {
            return next(new response_util_1.ErrorResponse("Bus not found", types_1.statusCode.Bad_Request));
        }
        // Create bus stop
        return yield tx.busStoppage.create({
            data: Object.assign(Object.assign({}, validData), { arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : null, departureTime: validData.departureTime ? new Date(validData.departureTime) : null }),
            include: {
                bus: { select: { id: true, name: true } },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Bus stop created successfully", busStop, types_1.statusCode.Created);
}));
exports.updateBusStop = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validData = Bus_1.BusStoppageSchema.partial().parse(req.body);
    if (!id) {
        return next(new response_util_1.ErrorResponse("Bus stop ID is required", types_1.statusCode.Bad_Request));
    }
    const busStop = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if bus stop exists
        const existingBusStop = yield tx.busStoppage.findUnique({
            where: { id },
        });
        if (!existingBusStop) {
            return next(new response_util_1.ErrorResponse("Bus stop not found", types_1.statusCode.Not_Found));
        }
        // Check if bus exists (if busId is provided)
        if (validData.busId) {
            const bus = yield tx.bus.findUnique({
                where: { id: validData.busId },
            });
            if (!bus) {
                return next(new response_util_1.ErrorResponse("Bus not found", types_1.statusCode.Bad_Request));
            }
        }
        // Update bus stop
        return yield tx.busStoppage.update({
            where: { id },
            data: Object.assign(Object.assign({}, validData), { arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : undefined, departureTime: validData.departureTime ? new Date(validData.departureTime) : undefined }),
            include: {
                bus: { select: { id: true, name: true } },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Bus stop updated successfully", busStop, types_1.statusCode.OK);
}));
exports.deleteBusStop = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Bus stop ID is required", types_1.statusCode.Bad_Request));
    }
    const busStop = yield prisma_1.default.busStoppage.findUnique({
        where: { id },
    });
    if (!busStop) {
        return next(new response_util_1.ErrorResponse("Bus stop not found", types_1.statusCode.Not_Found));
    }
    yield prisma_1.default.busStoppage.delete({
        where: { id },
    });
    return (0, response_util_1.SuccessResponse)(res, "Bus stop deleted successfully", {}, types_1.statusCode.OK);
}));
