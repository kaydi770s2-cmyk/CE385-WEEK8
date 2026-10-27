import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
/** รูปแบบ รู ข้อข้ผิดพลาด ผิ ชุดเ ชุ ดียวดี ที่ใที่ ช้ทั้ช้ งระบบ ทั้ — ฝั่ง client แกะที่เที่ ดียวจบ ดี */
interface ErrorBody {
error: { code: string; message: string; details?: unknown };
}
/* ---------- ไม่มีม่ route มี ไหนรับคํา ขอนี้ ---------- */
export const notFoundHandler: RequestHandler = (req, res) => {
const body: ErrorBody = {
error: {
code: "ROUTE_NOT_FOUND",
message: `ไม่มีม่ เมีส้นทาง ส้ ${req.method} ${req.originalUrl} ในระบบนี้` ,
},
};
res.status(404).json(body);
};
/* ---------- ตัวตัดักหดั ลักลั ---------- */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
// 1) ข้อข้มูลมู ที่ส่ที่ งมาไ ส่ ม่ผ่ม่ านผ่ schema
// 400 ถ้าถ้ผิดผิ ที่ path/query · 422 ที่ ถ้าถ้ผิดผิ ที่ body (validate() ที่ ติดติ ป้าย httpStatus มาให้)ห้
if (err instanceof ZodError) {
const status = (err as ZodError & { httpStatus?: number }).httpStatus ?? 422;
const body: ErrorBody = {
error: {
code: "VALIDATION_ERROR",
message: "ข้อข้มูลมู ที่ส่ที่ งมาไ ส่ ม่ถูม่ กถู ต้องต้ ",
details: err.issues.map((issue) => ({
field: issue.path.join(".") || "(ทั้งทั้ก้อนก้ )",
message: issue.message,
})),
},
};
res.status(status).json(body);
return;
}
// 2) ข้อข้ผิดพลาด ผิ ที่เรา ที่ ตั้งใจโยนเอง ตั้ → ใช้ status ช้ ที่ระที่ บุไบุ ว้
if (err instanceof AppError) {
const body: ErrorBody = { error: { code: err.code, message: err.message } };
res.status(err.statusCode).json(body);
return;
}
if (err instanceof Prisma.PrismaClientKnownRequestError) {
const map: Record<string, { status: number; code: string; message: string }> = {
// ชนกับกั @unique — เช่นร ช่ หัสหั นักศึกษาห ศึ รือรื อีเมล อี ซ้ํา
P2002: { status: 409, code: "DUPLICATE", message: "ข้อข้มูลมู นี้มีนี้ อมี ยู่แยู่ ล้วในระบบ ล้ " },
// update / delete แถวที่ไที่ ม่มีม่ อมี ยู่
P2025: { status: 404, code: "NOT_FOUND", message: "ไม่พบม่ ข้อข้มูลมู ที่ต้ที่ องการแ ต้ ก้ไขห ก้ รือลบ รื " },
// เชื่อมชื่ ต่อฐาน ต่ ข้อข้มูลไมู ม่ไม่ ด้
P1001: { status: 503, code: "DB_UNAVAILABLE", message: "ติดติ ต่อฐาน ต่ ข้อข้มูลไมู ม่ไม่ ด้" },
};
const hit = map[err.code];
if (hit) {
const target = (err.meta as { target?: string[] } | undefined)?.target;
const body: ErrorBody = {
error: {
code: hit.code,
message: hit.message,
details: target ? { field: target.join(", ") } : undefined,
},
};
res.status(hit.status).json(body);
return;
}
}
// 4) ที่เหที่ ลือลื คือคื สิ่งสิ่ ที่เราไ ที่ ม่ไม่ ด้คาดไ ด้ ว้ = bug ว้ ของเรา
// ตอบ 500 แบบกลาง ๆ ไม่รั่ม่ รั่วรายละเอียดภายในออกไปใ อี ห้ client ห้
// แต่พิต่ มพิ พ์ลงพ์ console ให้ครบ ห้ เพื่อใ พื่ ห้ผู้ห้ พัผู้ พัฒนาตามแก้ไก้ด้
console.error("[UNHANDLED]", err);
const body: ErrorBody = {
error: { code: "INTERNAL_ERROR", message: "เกิดกิข้อข้ผิดพลาดภายในระบบ ผิ " },
};
res.status(500).json(body);
};
// ...ต่อในสไล ต่ ด์ถัด์