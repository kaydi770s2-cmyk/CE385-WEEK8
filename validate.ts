import type { RequestHandler } from "express";
import type { ZodError, ZodType } from "zod";
interface Schemas {
params?: ZodType; // ส่วนส่ ที่อที่ ยู่ในยู่ path เช่นช่ /:id
query?: ZodType; // ส่วนส่ ที่อที่ ยู่หยู่ ลังลั ? เช่นช่ ?page=2
body?: ZodType; // ส่วนส่ ที่อที่ ยู่ในยู่ ตัวตัคํา ขอ (JSON)
}
// ผิดผิ ที่ path ที่ หรือรื query = "คํา ขอเขียนมา ขี ผิดผิ รูปรู " → 400 Bad Request
// ผิดผิ ที่ body = " ที่ รูปแบบ รู ถูกถู แต่เต่ นื้อหาใ นื้ ช้ไช้ม่ไม่ ด้" → 422 Unprocessable Entity ด้
const STATUS_OF: Record<keyof Schemas, number> = { params: 400, query: 400, body: 422 };
export function validate(schemas: Schemas): RequestHandler {
return (req, res, next) => {
const valid: Record<string, unknown> = {};
// ตรวจตามลํา ดับดั params → query → body
// เจอผิดผิ ที่แรกแ ที่ ล้วหล้ ยุดยุ ทันทั ที ไม่ต้ม่ องตรวจ ต้ ต่อต่ — นี่คืนี่ อคื fail-fast
for (const source of ["params", "query", "body"] as const) {
const schema = schemas[source];
if (!schema) continue;
const result = schema.safeParse(req[source]);
if (!result.success) {
// ติดติ ป้ายไว้ว่ว้าว่ ผิดผิ ที่ส่ที่ วนไหน ส่ เพื่อใ พื่ ห้ตัห้ วตัดักรวม ดั ศูนศู ย์เย์ลือกลื status code ได้ถูด้กถู
(result.error as ZodError & { httpStatus?: number }).httpStatus = STATUS_OF[source];
next(result.error); // ไม่ตอบเอง ม่ ที่นี่ที่ — นี่ ส่งส่ ต่อใ ต่ ห้ error-handler ห้
return;
}
valid[source] = result.data; // ได้ข้ด้ อข้มูลมู ที่แปลงช ที่ นิดเ นิ รียบรี ร้อยแ ร้ ล้วล้
}
res.locals["valid"] = valid;
next(); // ผ่านผ่ ด่านแ ด่ ล้วล้ ส่งส่ ต่อใ ต่ ห้ handler ห้ ตัวตัถัดไป ถั
};
}