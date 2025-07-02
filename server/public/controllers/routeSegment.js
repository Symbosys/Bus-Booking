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
exports.deleteRouteSegment = exports.updateRouteSegment = exports.createRouteSegment = exports.getRouteSegmentById = exports.getAllRouteSegments = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const response_util_1 = require("../utils/response.util");
const types_1 = require("../types/types");
const Bus_1 = require("../zod/Bus");
const prisma_1 = __importDefault(require("../config/prisma"));
exports.getAllRouteSegments = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Pagination and filtering
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const routeId = req.query.routeId ? String(req.query.routeId) : undefined;
    const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;
    // Build where clause
    const where = {};
    if (searchQuery) {
        where.OR = [
            { startLocation: { contains: searchQuery, mode: "insensitive" } },
            { endLocation: { contains: searchQuery, mode: "insensitive" } },
        ];
    }
    if (routeId)
        where.routeId = routeId;
    const [routeSegments, totalRouteSegments] = yield Promise.all([
        prisma_1.default.routeSegment.findMany({
            where,
            skip,
            take: limit,
            orderBy: { sequence: "asc" }, // Sort by sequence for logical order
            include: {
                route: { select: { id: true, name: true } },
                boardingBookings: { select: { id: true } },
                alightingBookings: { select: { id: true } },
            },
        }),
        prisma_1.default.routeSegment.count({ where }),
    ]);
    if (page > Math.ceil(totalRouteSegments / limit) && totalRouteSegments > 0) {
        return next(new response_util_1.ErrorResponse("Page not found", types_1.statusCode.Not_Found));
    }
    return (0, response_util_1.SuccessResponse)(res, "Route segments retrieved successfully", {
        routeSegments,
        currentPage: page,
        totalPages: Math.ceil(totalRouteSegments / limit),
        totalRouteSegments,
        count: routeSegments.length,
        hasNextPage: page * limit < totalRouteSegments,
        hasPrevPage: page > 1,
    });
}));
exports.getRouteSegmentById = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Route segment ID is required", types_1.statusCode.Bad_Request));
    }
    const routeSegment = yield prisma_1.default.routeSegment.findUnique({
        where: { id },
        include: {
            route: { select: { id: true, name: true } },
            boardingBookings: { select: { id: true } },
            alightingBookings: { select: { id: true } },
        },
    });
    if (!routeSegment) {
        return next(new response_util_1.ErrorResponse("Route segment not found", types_1.statusCode.Not_Found));
    }
    return (0, response_util_1.SuccessResponse)(res, "Route segment retrieved successfully", routeSegment, types_1.statusCode.OK);
}));
exports.createRouteSegment = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = Bus_1.RouteSegmentSchema.parse(req.body);
    const routeSegment = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if route exists
        const route = yield tx.route.findUnique({
            where: { id: validData.routeId },
        });
        if (!route) {
            return next(new response_util_1.ErrorResponse("Route not found", types_1.statusCode.Bad_Request));
        }
        // Check for duplicate sequence in the same route
        const existingSegment = yield tx.routeSegment.findFirst({
            where: {
                routeId: validData.routeId,
                sequence: validData.sequence,
            },
        });
        if (existingSegment) {
            return next(new response_util_1.ErrorResponse("A segment with this sequence already exists for this route", types_1.statusCode.Bad_Request));
        }
        // Create route segment
        return yield tx.routeSegment.create({
            data: Object.assign(Object.assign({}, validData), { arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : null, departureTime: validData.departureTime ? new Date(validData.departureTime) : null }),
            include: {
                route: { select: { id: true, name: true } },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Route segment created successfully", routeSegment, types_1.statusCode.Created);
}));
exports.updateRouteSegment = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validData = Bus_1.RouteSegmentSchema.partial().parse(req.body);
    if (!id) {
        return next(new response_util_1.ErrorResponse("Route segment ID is required", types_1.statusCode.Bad_Request));
    }
    const routeSegment = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if route segment exists
        const existingSegment = yield tx.routeSegment.findUnique({
            where: { id },
        });
        if (!existingSegment) {
            return next(new response_util_1.ErrorResponse("Route segment not found", types_1.statusCode.Not_Found));
        }
        // Check if route exists (if routeId is provided)
        if (validData.routeId) {
            const route = yield tx.route.findUnique({
                where: { id: validData.routeId },
            });
            if (!route) {
                return next(new response_util_1.ErrorResponse("Route not found", types_1.statusCode.Bad_Request));
            }
        }
        // Check for duplicate sequence (if sequence is provided)
        if (validData.sequence && validData.routeId) {
            const existingSegment = yield tx.routeSegment.findFirst({
                where: {
                    routeId: validData.routeId,
                    sequence: validData.sequence,
                    NOT: { id },
                },
            });
            if (existingSegment) {
                return next(new response_util_1.ErrorResponse("A segment with this sequence already exists for this route", types_1.statusCode.Bad_Request));
            }
        }
        // Update route segment
        return yield tx.routeSegment.update({
            where: { id },
            data: Object.assign(Object.assign({}, validData), { arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : undefined, departureTime: validData.departureTime ? new Date(validData.departureTime) : undefined }),
            include: {
                route: { select: { id: true, name: true } },
            },
        });
    }));
    return (0, response_util_1.SuccessResponse)(res, "Route segment updated successfully", routeSegment, types_1.statusCode.OK);
}));
exports.deleteRouteSegment = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new response_util_1.ErrorResponse("Route segment ID is required", types_1.statusCode.Bad_Request));
    }
    const routeSegment = yield prisma_1.default.routeSegment.findUnique({
        where: { id },
    });
    if (!routeSegment) {
        return next(new response_util_1.ErrorResponse("Route segment not found", types_1.statusCode.Not_Found));
    }
    // Check for dependent bookings
    const bookings = yield prisma_1.default.booking.findFirst({
        where: {
            OR: [
                { boardingSegmentId: id },
                { alightingSegmentId: id },
            ],
        },
    });
    if (bookings) {
        return next(new response_util_1.ErrorResponse("Cannot delete route segment with active bookings", types_1.statusCode.Bad_Request));
    }
    yield prisma_1.default.routeSegment.delete({
        where: { id },
    });
    return (0, response_util_1.SuccessResponse)(res, "Route segment deleted successfully", {}, types_1.statusCode.OK);
}));
