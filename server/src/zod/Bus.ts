
import { z } from 'zod';

// Enum Schemas
const BookingStatusSchema = z.enum(['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED']);
const StopStatusSchema = z.enum(['SCHEDULED', 'ARRIVED', 'DEPARTED', 'CANCELLED']);
const SeatLayoutSchema = z.enum(['TWO_BY_ONE', 'TWO_BY_TWO', 'THREE_BY_TWO']);
const TypeSchema = z.enum(['AC', 'Non_AC']);
const SeaterTypeSchema = z.enum(['SEATER', 'SLEEPER', 'MIXED']);
const DeckTypeSchema = z.enum(['SINGLE', 'DOUBLE', 'TRIPLE']);
const GenderTypeSchema = z.enum(['Male', 'Female', 'Unassigned']);

// Bus Schema
const BusSchema = z.object({
  name: z.string().min(1, 'name is required'),
  number: z.string().min(1, 'number is required'),
  description: z.string().optional(),
  type: TypeSchema.default('Non_AC'),
  seatType: SeaterTypeSchema.default('SEATER'),
  deckType: DeckTypeSchema.default('SINGLE'),
  seatLayout: SeatLayoutSchema.default('TWO_BY_ONE'),
  time: z.string().datetime({ message: 'time must be a valid ISO 8601 datetime' }).optional(),
  seats: z.number().int().min(0, 'seats must be a non-negative integer'),
  totalSeaters: z.number().int().min(0, 'totalSeaters must be a non-negative integer').optional(),
  TotalSleeper: z.number().int().min(0, 'TotalSleeper must be a non-negative integer').optional(),
  isActive: z.boolean().default(true),
  vendorId: z.string().min(1, 'vendorId is required'),
  image: z.string().url('image must be a valid URL').optional()
});

// Route Schema
const RouteSchema = z.object({
  name: z.string().min(1, 'name is required'),
  source: z.string().min(1, 'source is required'),
  destination: z.string().min(1, 'destination is required'),
  distance: z.number().int().min(0, 'distance must be a non-negative integer'),
  price: z.number().min(0, 'price must be a non-negative number'),
  busId: z.string().min(1, 'busId is required')
});

// RouteSegment Schema
const RouteSegmentSchema = z.object({
  routeId: z.string().min(1, 'routeId is required'),
  startLocation: z.string().min(1, 'startLocation is required'),
  endLocation: z.string().min(1, 'endLocation is required'),
  sequence: z.number().int().min(1, 'sequence must be a positive integer'),
  distance: z.number().int().min(0, 'distance must be a non-negative integer').optional(),
  duration: z.number().int().min(0, 'duration must be a non-negative integer').optional(),
  price: z.number().min(0, 'price must be a non-negative number').optional(),
  arrivalTime: z.string().datetime({ message: 'arrivalTime must be a valid ISO 8601 datetime' }).optional(),
  departureTime: z.string().datetime({ message: 'departureTime must be a valid ISO 8601 datetime' }).optional()
});

// Seat Schema
const SeatSchema = z.object({
  busId: z.string().min(1, 'busId is required'),
  seatNumber: z.string().min(1, 'seatNumber is required'),
  gender: GenderTypeSchema.default('Unassigned'),
  isBooked: z.boolean().default(false)
});

// BusStoppage Schema
const BusStoppageSchema = z.object({
  busId: z.string().min(1, 'busId is required'),
  busStandName: z.string().min(1, 'busStandName is required'),
  arrivalTime: z.string().datetime({ message: 'arrivalTime must be a valid ISO 8601 datetime' }).optional(),
  departureTime: z.string().datetime({ message: 'departureTime must be a valid ISO 8601 datetime' }).optional(),
  status: StopStatusSchema.default('SCHEDULED')
});

// Booking Schema
const BookingSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  busId: z.string().min(1, 'busId is required'),
  seatId: z.string().min(1, 'seatId is required'),
  passengerGender: GenderTypeSchema.default('Unassigned'),
  routeId: z.string().min(1, 'routeId is required'),
  boardingSegmentId: z.string().min(1, 'boardingSegmentId must be a valid string').optional(),
  alightingSegmentId: z.string().min(1, 'alightingSegmentId must be a valid string').optional(),
  bookingDate: z.string().datetime({ message: 'bookingDate must be a valid ISO 8601 datetime' }).default(() => new Date().toISOString()),
  travelDate: z.string().datetime({ message: 'travelDate must be a valid ISO 8601 datetime' }),
  price: z.number().min(0, 'price must be a non-negative number'),
  status: BookingStatusSchema.default('PENDING')
});

// Export all schemas
export {
  BusSchema,
  RouteSchema,
  RouteSegmentSchema,
  SeatSchema,
  BusStoppageSchema,
  BookingSchema,
  BookingStatusSchema,
  StopStatusSchema,
  SeatLayoutSchema,
  TypeSchema,
  SeaterTypeSchema,
  DeckTypeSchema,
  GenderTypeSchema,
};
