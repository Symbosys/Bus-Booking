"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderTypeSchema = exports.DeckTypeSchema = exports.SeaterTypeSchema = exports.TypeSchema = exports.SeatLayoutSchema = exports.StopStatusSchema = exports.BookingStatusSchema = exports.BookingSchema = exports.BusStoppageSchema = exports.SeatSchema = exports.RouteSegmentSchema = exports.RouteSchema = exports.BusSchema = void 0;
const zod_1 = require("zod");
// Enum Schemas
const BookingStatusSchema = zod_1.z.enum(['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED']);
exports.BookingStatusSchema = BookingStatusSchema;
const StopStatusSchema = zod_1.z.enum(['SCHEDULED', 'ARRIVED', 'DEPARTED', 'CANCELLED']);
exports.StopStatusSchema = StopStatusSchema;
const SeatLayoutSchema = zod_1.z.enum(['TWO_BY_ONE', 'TWO_BY_TWO', 'THREE_BY_TWO']);
exports.SeatLayoutSchema = SeatLayoutSchema;
const TypeSchema = zod_1.z.enum(['AC', 'Non_AC']);
exports.TypeSchema = TypeSchema;
const SeaterTypeSchema = zod_1.z.enum(['SEATER', 'SLEEPER', 'MIXED']);
exports.SeaterTypeSchema = SeaterTypeSchema;
const DeckTypeSchema = zod_1.z.enum(['SINGLE', 'DOUBLE', 'TRIPLE']);
exports.DeckTypeSchema = DeckTypeSchema;
const GenderTypeSchema = zod_1.z.enum(['Male', 'Female', 'Unassigned']);
exports.GenderTypeSchema = GenderTypeSchema;
// Bus Schema
const BusSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'name is required'),
    number: zod_1.z.string().min(1, 'number is required'),
    description: zod_1.z.string().optional(),
    type: TypeSchema.default('Non_AC'),
    seatType: SeaterTypeSchema.default('SEATER'),
    deckType: DeckTypeSchema.default('SINGLE'),
    seatLayout: SeatLayoutSchema.default('TWO_BY_ONE'),
    time: zod_1.z.string().datetime({ message: 'time must be a valid ISO 8601 datetime' }).optional(),
    seats: zod_1.z.number().int().min(0, 'seats must be a non-negative integer'),
    totalSeaters: zod_1.z.number().int().min(0, 'totalSeaters must be a non-negative integer').optional(),
    TotalSleeper: zod_1.z.number().int().min(0, 'TotalSleeper must be a non-negative integer').optional(),
    isActive: zod_1.z.boolean().default(true),
    vendorId: zod_1.z.string().min(1, 'vendorId is required'),
    image: zod_1.z.string().url('image must be a valid URL').optional()
});
exports.BusSchema = BusSchema;
// Route Schema
const RouteSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'name is required'),
    source: zod_1.z.string().min(1, 'source is required'),
    destination: zod_1.z.string().min(1, 'destination is required'),
    distance: zod_1.z.number().int().min(0, 'distance must be a non-negative integer'),
    price: zod_1.z.number().min(0, 'price must be a non-negative number'),
    busId: zod_1.z.string().min(1, 'busId is required')
});
exports.RouteSchema = RouteSchema;
// RouteSegment Schema
const RouteSegmentSchema = zod_1.z.object({
    routeId: zod_1.z.string().min(1, 'routeId is required'),
    startLocation: zod_1.z.string().min(1, 'startLocation is required'),
    endLocation: zod_1.z.string().min(1, 'endLocation is required'),
    sequence: zod_1.z.number().int().min(1, 'sequence must be a positive integer'),
    distance: zod_1.z.number().int().min(0, 'distance must be a non-negative integer').optional(),
    duration: zod_1.z.number().int().min(0, 'duration must be a non-negative integer').optional(),
    price: zod_1.z.number().min(0, 'price must be a non-negative number').optional(),
    arrivalTime: zod_1.z.string().datetime({ message: 'arrivalTime must be a valid ISO 8601 datetime' }).optional(),
    departureTime: zod_1.z.string().datetime({ message: 'departureTime must be a valid ISO 8601 datetime' }).optional()
});
exports.RouteSegmentSchema = RouteSegmentSchema;
// Seat Schema
const SeatSchema = zod_1.z.object({
    busId: zod_1.z.string().min(1, 'busId is required'),
    seatNumber: zod_1.z.string().min(1, 'seatNumber is required'),
    gender: GenderTypeSchema.default('Unassigned'),
    isBooked: zod_1.z.boolean().default(false)
});
exports.SeatSchema = SeatSchema;
// BusStoppage Schema
const BusStoppageSchema = zod_1.z.object({
    busId: zod_1.z.string().min(1, 'busId is required'),
    busStandName: zod_1.z.string().min(1, 'busStandName is required'),
    arrivalTime: zod_1.z.string().datetime({ message: 'arrivalTime must be a valid ISO 8601 datetime' }).optional(),
    departureTime: zod_1.z.string().datetime({ message: 'departureTime must be a valid ISO 8601 datetime' }).optional(),
    status: StopStatusSchema.default('SCHEDULED')
});
exports.BusStoppageSchema = BusStoppageSchema;
// Booking Schema
const BookingSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'userId is required'),
    busId: zod_1.z.string().min(1, 'busId is required'),
    seatId: zod_1.z.string().min(1, 'seatId is required'),
    passengerGender: GenderTypeSchema.default('Unassigned'),
    routeId: zod_1.z.string().min(1, 'routeId is required'),
    boardingSegmentId: zod_1.z.string().min(1, 'boardingSegmentId must be a valid string').optional(),
    alightingSegmentId: zod_1.z.string().min(1, 'alightingSegmentId must be a valid string').optional(),
    bookingDate: zod_1.z.string().datetime({ message: 'bookingDate must be a valid ISO 8601 datetime' }).default(() => new Date().toISOString()),
    travelDate: zod_1.z.string().datetime({ message: 'travelDate must be a valid ISO 8601 datetime' }),
    price: zod_1.z.number().min(0, 'price must be a non-negative number'),
    status: BookingStatusSchema.default('PENDING')
});
exports.BookingSchema = BookingSchema;
