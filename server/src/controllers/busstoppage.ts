
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Get all bus stops
export const getAllBusStops = async (req: Request, res: Response) => {
  const busStops = await prisma.busStop.findMany({
    include: {
      bus: { select: { id: true, name: true } },
    },
  });
  res.status(200).json(busStops);
};

// Get a single bus stop by ID
export const getBusStopById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const busStop = await prisma.busStop.findUnique({
    where: { id },
    include: {
      bus: { select: { id: true, name: true } },
    },
  });
  if (!busStop) {
    return res.status(404).json({ error: 'Bus stop not found' });
  }
  res.status(200).json(busStop);
};

// Create a new bus stop
export const createBusStop = async (req: Request, res: Response) => {
  const { busId, busStandName, arrivalTime, departureTime, status } = req.body;
  const busStop = await prisma.busStop.create({
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
};

// Update a bus stop
export const updateBusStop = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { busId, busStandName, arrivalTime, departureTime, status } = req.body;
  const busStop = await prisma.busStop.update({
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
};

// Delete a bus stop
export const deleteBusStop = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.busStop.delete({
    where: { id },
  });
  res.status(204).send();
};