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
exports.deleteRoute = exports.updateRoute = exports.createRoute = exports.getRouteById = exports.getAllRoutes = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const response_util_1 = require("../utils/response.util");
const types_1 = require("../types/types");
const Bus_1 = require("../zod/Bus");
exports.getAllRoutes = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const busId = req.query.busId ? String(req.query.busId) : undefined;
    const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;
    // Build where clause
    const where = {};
    if (searchQuery) {
        where.OR = [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { source: { contains: searchQuery, mode: "insensitive" } },
            { destination: { contains: searchQuery, mode: "insensitive" } },
        ];
    }
    if (busId)
        where.busId = busId;
    const [routes, totalRoutes] = yield Promise.all([
        prisma_1.default.route.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                bus: { select: { id: true, name: true } },
                segments: { select: { id: true, startLocation: true, endLocation: true } },
                bookings: { select: { id: true } },
            },
        }),
        prisma_1.default.route.count({ where }),
    ]);
    if (page > Math.ceil(totalRoutes / limit) && totalRoutes > 0) {
        return next(new response_util_1.ErrorResponse("Page not found", types_1.statusCode.Not_Found));
    }
    return (0, response_util_1.SuccessResponse)(res, "Routes retrieved successfully", {
        routes,
        currentPage: page,
        totalPages: Math.ceil(totalRoutes / limit),
        totalRoutes,
        count: routes.length,
        hasNextPage: page * limit < totalRoutes,
        hasPrevPage: page > 1,
    });
}));
exports.getRouteById = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Route ID is required", types_1.statusCode.Bad_Request));
    }
    const route = yield prisma_1.default.route.findUnique({
        where: { id },
        include: {
            bus: { select: { id: true, name: true } },
            segments: { select: { id: true, startLocation: true, endLocation: true } },
            bookings: { select: { id: true } },
        },
    });
    if (!route) {
        return next(new response_util_1.ErrorResponse("Route not found", types_1.statusCode.Not_Found));
    }
    return (0, response_util_1.SuccessResponse)(res, "Route retrieved successfully", route, types_1.statusCode.OK);
}));
exports.createRoute = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = Bus_1.RouteSchema.parse(req.body);
    const route = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if bus exists
        const bus = yield tx.bus.findUnique({
            where: { id: validData.busId },
        });
        if (!bus) {
            return next(new response_util_1.ErrorResponse("Bus not found", types_1.statusCode.Bad_Request));
        }
        // Check if route with same source and destination exists for this bus
        const existingRoute = yield tx.route.findFirst({
            where: {
                busId: validData.busId,
                source: validData.source,
                destination: validData.destination,
            },
        });
        if (existingRoute) {
            return next(new response_util_1.ErrorResponse("Route with this source and destination already exists for this bus", types_1.statusCode.Bad_Request));
        }
        // Create route
        return yield tx.route.create({
            data: validData,
            include: {
                bus: { select: { id: true, name: true } },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Route created successfully", route, types_1.statusCode.Created);
}));
exports.updateRoute = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validData = Bus_1.RouteSchema.partial().parse(req.body);
    if (!id) {
        return next(new response_util_1.ErrorResponse("Route ID is required", types_1.statusCode.Bad_Request));
    }
    const route = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if route exists
        const existingRoute = yield tx.route.findUnique({
            where: { id },
        });
        if (!existingRoute) {
            return next(new response_util_1.ErrorResponse("Route not found", types_1.statusCode.Not_Found));
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
        // Check for duplicate source/destination (if provided)
        if (validData.source && validData.destination && validData.busId) {
            const existingRoute = yield tx.route.findFirst({
                where: {
                    busId: validData.busId,
                    source: validData.source,
                    destination: validData.destination,
                    NOT: { id },
                },
            });
            if (existingRoute) {
                return next(new response_util_1.ErrorResponse("Route with this source and destination already exists for this bus", types_1.statusCode.Bad_Request));
            }
        }
        // Update route
        return yield tx.route.update({
            where: { id },
            data: validData,
            include: {
                bus: { select: { id: true, name: true } },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Route Iupdated successfully", route, types_1.statusCode.OK);
}));
exports.deleteRoute = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Route ID is required", types_1.statusCode.Bad_Request));
    }
    const route = yield prisma_1.default.route.findUnique({
        where: { id },
    });
    if (!route) {
        return next(new response_util_1.ErrorResponse("Route not found", types_1.statusCode.Not_Found));
    }
    // Check for dependent bookings
    const bookings = yield prisma_1.default.booking.findFirst({
        where: { routeId: id },
    });
    if (bookings) {
        return next(new response_util_1.ErrorResponse("Cannot delete route with active bookings", types_1.statusCode.Bad_Request));
    }
    yield prisma_1.default.route.delete({
        where: { id },
    });
    return (0, response_util_1.SuccessResponse)(res, "Route deleted successfully", {}, types_1.statusCode.OK);
}));
