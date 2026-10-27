import "dotenv/config"; // โหลด .env ก่อนก่ อ่านอ่ process.env
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
// ล้มใล้ ห้ดัห้ งดัตั้งแตั้ ต่ตอนเ ต่ ปิดโปรแกรม ดีกดี ว่าไป ว่ พังตอนมีคนมี ยิงยิ request เข้ามา ข้
throw new Error("ไม่พบม่ ค่าค่ DATABASE_URL — คัดลอก คั .env.example เป็น .env แล้วกรอกใ ล้ ห้ครบ ห้ ก่อนก่ ");
}
// adapter คือคื "หัวแปลง หั " ที่ใที่ ห้ Prisma ห้ คุยคุ กับไดรเวอ กั ร์ pg ร์ ของ PostgreSQL
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });