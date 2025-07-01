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
exports.deleteBusStop = exports.updateBusStop = exports.createBusStop = exports.getBusStopById = exports.getAllBusStops = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all bus stops
const getAllBusStops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const busStops = yield prisma.busStop.findMany({
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    res.status(200).json(busStops);
});
exports.getAllBusStops = getAllBusStops;
// Get a single bus stop by ID
const getBusStopById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const busStop = yield prisma.busStop.findUnique({
        where: { id },
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    if (!busStop) {
        return res.status(404).json({ error: 'Bus stop not found' });
    }
    res.status(200).json(busStop);
});
exports.getBusStopById = getBusStopById;
// Create a new bus stop
const createBusStop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { busId, busStandName, arrivalTime, departureTime, status } = req.body;
    const busStop = yield prisma.busStop.create({
        data: {
            busId,
            busStandName,
            arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
            departureTime: departureTime ? new Date(departureTime) : null,
            status,
        },
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    res.status(201).json(busStop);
});
exports.createBusStop = createBusStop;
// Update a bus stop
const updateBusStop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { busId, busStandName, arrivalTime, departureTime, status } = req.body;
    const busStop = yield prisma.busStop.update({
        where: { id },
        data: {
            busId,
            busStandName,
            arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
            departureTime: departureTime ? new Date(departureTime) : null,
            status,
        },
        include: {
            bus: { select: { id: true, name: true } },
        },
    });
    res.status(200).json(busStop);
});
exports.updateBusStop = updateBusStop;
// Delete a bus stop
const deleteBusStop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.busStop.delete({
        where: { id },
    });
    res.status(204).send();
});
exports.deleteBusStop = deleteBusStop;
