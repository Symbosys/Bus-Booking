import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all route segments
export const getAllRouteSegments = async (req: Request, res: Response) => {
  const routeSegments = await prisma.routeSegment.findMany({
    include: {
      route: { select: { id: true, name: true } },
      boardingBookings: { select: { id: true } },
      alightingBookings: { select: { id: true } },
    },
  });
  res.status(200).json(routeSegments);
};

// Get a single route segment by ID
export const getRouteSegmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const routeSegment = await prisma.routeSegment.findUnique({
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
};

// Create a new route segment
export const createRouteSegment = async (req: Request, res: Response) => {
  const {
    routeId,
    startLocation,
    endLocation,
    sequence,
    distance,
    duration,
    price,
    arrivalTime,
    departureTime,
  } = req.body;
  const routeSegment = await prisma.routeSegment.create({
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
};

// Update a route segment
export const updateRouteSegment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    routeId,
    startLocation,
    endLocation,
    sequence,
    distance,
    duration,
    price,
    arrivalTime,
    departureTime,
  } = req.body;
  const routeSegment = await prisma.routeSegment.update({
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
};

// Delete a route segment
export const deleteRouteSegment = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.routeSegment.delete({
    where: { id },
  });
  res.status(204).send();
};