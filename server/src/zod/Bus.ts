import z from "zod"
const BusSchema = z.object({
    name: z.string().min(1, "Bus name is required"),
    number: z.string().min(1, "Bus number is required"),
    acType: z.enum(["AC", "Non_AC"], { message: "Invalid AC type" }),
    seaterType: z.enum(["sleeper", "seater"], { message: "Invalid seater type" }),
    deckType: z.enum(["lower", "upper"], { message: "Invalid deck type" }),
    time: z.string().min(1, "Time is required"), // Add regex if specific format needed
    isActive: z.boolean().optional().default(true),
    vendorId: z.string().uuid("Invalid vendor ID"),
  });
  export default BusSchema;