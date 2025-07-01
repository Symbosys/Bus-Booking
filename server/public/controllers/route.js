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
// Get all routes
const getAllRoutes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const routes = yield prisma_1.default.route.findMany({
        include: {
            bus: { select: { id: true, name: true } },
            segments: { select: { id: true, startLocation: true, endLocation: true } },
            bookings: { select: { id: true } },
        },
    });
    res.status(200).json(routes);
});
exports.getAllRoutes = getAllRoutes;
// Get a single route by ID
const getRouteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const route = yield prisma_1.default.route.findUnique({
        where: { id },
        include: {
            bus: { select: { id: true, name: true } },
            segments: { select: { id: true, startLocation: true, endLocation: true } },
            bookings: { select: { id: true } },
        },
    });
    if (!route) {
        return res.status(404).json({ error: 'Route not found' });
    }
    res.status(200).json(route);
});
exports.getRouteById = getRouteById;
// Create a new route
const createRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, source, destination, distance, price, busId } = req.body;
    const route = yield prisma_1.default.route.create({
        data: {
            name,
            source,
            destination,
            distance: Number(distance),
            price: Number(price),
            busId,
        },
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    res.status(201).json(route);
});
exports.createRoute = createRoute;
// Update a route
const updateRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, source, destination, distance, price, busId } = req.body;
    const route = yield prisma_1.default.route.update({
        where: { id },
        data: {
            name,
            source,
            destination,
            distance: Number(distance),
            price: Number(price),
            busId,
        },
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    res.status(200).json(route);
});
exports.updateRoute = updateRoute;
// Delete a route
const deleteRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.route.delete({
        where: { id },
    });
    res.status(204).send();
});
exports.deleteRoute = deleteRoute;
