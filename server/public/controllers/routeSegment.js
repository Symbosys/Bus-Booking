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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRouteSegment = exports.updateRouteSegment = exports.createRouteSegment = exports.getRouteSegmentById = exports.getAllRouteSegments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all route segments
const getAllRouteSegments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const routeSegments = yield prisma.routeSegment.findMany({
        include: {
            route: { select: { id: true, name: true } },
            boardingBookings: { select: { id: true } },
            alightingBookings: { select: { id: true } },
        },
    });
    res.status(200).json(routeSegments);
});
exports.getAllRouteSegments = getAllRouteSegments;
// Get a single route segment by ID
const getRouteSegmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const routeSegment = yield prisma.routeSegment.findUnique({
        where: { id },
        include: {
            route: { select: { id: true, name: true } },
            boardingBookings: { select: { id: true } },
            alightingBookings: { select: { id: true } },
        },
    });
    if (!routeSegment) {
        return res.status(404).json({ error: 'Route segment not found' });
    }
    res.status(200).json(routeSegment);
});
exports.getRouteSegmentById = getRouteSegmentById;
// Create a new route segment
const createRouteSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routeId, startLocation, endLocation, sequence, distance, duration, price, arrivalTime, departureTime, } = req.body;
    const routeSegment = yield prisma.routeSegment.create({
        data: {
            routeId,
            startLocation,
            endLocation,
            sequence: Number(sequence),
            distance: distance ? Number(distance) : null,
            duration: duration ? Number(duration) : null,
            price: price ? Number(price) : null,
            arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
            departureTime: departureTime ? new Date(departureTime) : null,
        },
        include: {
            route: { select: { id: true, name: true } },
        },
    });
    res.status(201).json(routeSegment);
});
exports.createRouteSegment = createRouteSegment;
// Update a route segment
const updateRouteSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { routeId, startLocation, endLocation, sequence, distance, duration, price, arrivalTime, departureTime, } = req.body;
    const routeSegment = yield prisma.routeSegment.update({
        where: { id },
        data: {
            routeId,
            startLocation,
            endLocation,
            sequence: Number(sequence),
            distance: distance ? Number(distance) : null,
            duration: duration ? Number(duration) : null,
            price: price ? Number(price) : null,
            arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
            departureTime: departureTime ? new Date(departureTime) : null,
        },
        include: {
            route: { select: { id: true, name: true } },
        },
    });
    res.status(200).json(routeSegment);
});
exports.updateRouteSegment = updateRouteSegment;
// Delete a route segment
const deleteRouteSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.routeSegment.delete({
        where: { id },
    });
    res.status(204).send();
});
exports.deleteRouteSegment = deleteRouteSegment;
