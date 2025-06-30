import { PrismaClient, GenderType } from '@prisma/client';

const prisma = new PrismaClient();

interface BookSeatInput {
  seatId: string;
  gender: GenderType;
  userId: string;
}

/**
 * Books a seat for a user if available and gender rules are met
 * @param input - Object containing seatId, gender, and userId
 * @returns The booked seat or throws an error if booking fails
 */
async function bookSeat(input: BookSeatInput) {
  const { seatId, gender, userId } = input;

  try {
    // Start a transaction to ensure atomicity
    const seat = await prisma.$transaction(async (tx) => {
      // Find the seat
      const targetSeat = await tx.seat.findUnique({
        where: { id: seatId },
        include: { bus: true },
      });

      if (!targetSeat) {
        throw new Error('Seat not found');
      }

      if (targetSeat.isBooked) {
        throw new Error('Seat is already booked');
      }

      // Optional: Check gender compatibility (if bus has specific rules)
      if (
        targetSeat.gender !== GenderType.Unassigned &&
        targetSeat.gender !== gender
      ) {
        throw new Error('Gender designation mismatch');
      }

      // Update seat to booked status
      const updatedSeat = await tx.seat.update({
        where: { id: seatId },
        data: {
          isBooked: true,
          gender,
          updatedAt: new Date(),
        },
      });

      // Optional: Create a booking record (assuming a Booking model exists)
      await tx.booking.create({
        data: {
          userId,
          seatId,
          busId: targetSeat.busId,
          bookedAt: new Date(),
        },
      });

      return updatedSeat;
    });

    return seat;
  } catch (error) {
    throw new Error(`Failed to book seat: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
                                    
export { bookSeat, BookSeatInput };