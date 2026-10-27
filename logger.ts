import type { RequestHandler } from "express";
export const logger: RequestHandler = (req, res, next) => {
const startedAt = Date.now();
// res.on("finish") ยิงเยิ มื่อมื่ Express ส่งส่ response ออกไปเรียบรี ร้อยแ ร้ ล้วล้
res.on("finish", () => {
const ms = Date.now() - startedAt;
console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms} ms)`);
});
next();
};