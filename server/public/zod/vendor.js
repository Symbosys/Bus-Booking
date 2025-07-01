"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const vendorSchema = zod_1.default.object({
    name: zod_1.default.string({ required_error: "name is required" }).min(4, { message: "name must be 4 char" }).optional(),
    email: zod_1.default.string({ required_error: "email is required" }).optional(),
    number: zod_1.default.string({ required_error: "number is required" }).min(10, { message: "number must be 10 char" }).max(10, { message: "number must be 10 char" }),
    otp: zod_1.default.string({ required_error: "otp is required" }).min(6, { message: "otp must be 6 char" }).max(6, { message: "otp must be 6 char" }).optional(),
    addhar_number: zod_1.default.string({ required_error: "addharis required" }).min(12, { message: "addhar_number must be 12 char" }).max(12, { message: "addhar_number must be 12 char" }).optional(),
    pan_number: zod_1.default.string({ required_error: "pan_number is required" }).min(9, { message: "pan_number must be 9 char" }).min(12, { message: "pan_number must be 12 char" }).optional(),
    panotp: zod_1.default.string({ required_error: "panotp is required" }).min(6, { message: "panotp must be 6 char" }).optional(),
    addharotp: zod_1.default.string({ required_error: "addhar is required" }).min(6, { message: "addharotp is 6 character" }).optional()
});
exports.default = vendorSchema;
