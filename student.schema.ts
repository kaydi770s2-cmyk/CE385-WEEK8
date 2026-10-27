// src/schemas/student.schema.ts — "ยาม" ที่ประ ที่ ตูหตู น้าของระบบ น้
// หน้าน้ที่เที่ ดียวดี : บอกว่าว่ ข้อข้มูลมู ที่ยอม ที่ รับได้ต้ด้ องต้ มีรูมีปรู ร่างแบบไหน ร่
// ไฟล์นี้ล์ ไนี้ ม่รู้ม่ จัรู้ จัก Express และไม่รู้ม่ จัรู้ จักฐานข้อข้มูลมู
import { z } from "zod";
/* ---------- 1) นิยามของแ นิ ต่ละ ต่ ฟิลด์ เขียนค ขี รั้งเรั้ ดียวดี ใช้ซ้ําช้ ซ้ําได้ ---------- */
// ข้อความใน ข้ { error: "..." } คือคื ข้อความ ข้ ที่ใที่ ช้เช้มื่อมื่ "ชนิดนิ ข้อข้มูลมู ผิดผิ "
// ซึ่งรวมกร ซึ่ ณีที่ไที่ ม่ส่ม่ งส่ ฟิลด์นี้ด์ มาเลย นี้ ด้วยด้ — ถ้าไถ้ ม่ใม่ ส่ Zod ส่ จะขึ้นขึ้ ข้อความ ข้ อังกฤษของ อั มันเอง มั
const studentFields = {
    code: z
        .string({ error: "ต้องระ ต้ บุรบุ หัสหั นักศึกษา ศึ " })
        .trim()
        .regex(/^\d{8,10}$/, "รหัสหั นักศึกษา ศึ ต้องเ ต้ ป็นตัวเลข ตั 8–10 หลักลั "),
    name: z
        .string({ error: "ต้องระ ต้ บุชื่บุ อชื่ –นามสกุลกุ " })
        .trim()
        .min(2, "ชื่อชื่ ต้องยาวอ ต้ ย่างย่ น้อยน้ 2 ตัวตัอักษร อั ")
        .max(100, "ชื่อยาวเ ชื่ กินกิ 100 ตัวตัอักษร อั "),
    email: z.email("รูปแบบ รู อีเมลไ อี ม่ถูม่ กถู ต้องต้ "),
    score: z.coerce
        .number({ error: "คะแนนต้องเ ต้ ป็นตัวเลข ตั " })
        .int("คะแนนต้องเ ต้ ป็นจํา นวนเต็ม")
        .min(0, "คะแนนต้องไ ต้ ม่ต่ําม่ ต่ํา กว่าว่ 0")
        .max(100, "คะแนนต้องไ ต้ ม่เม่ กินกิ 100"),
    active: z.boolean({ error: "active ต้องเ ต้ ป็น true หรือรื false" }),
};

/* ---------- 2) POST /students — ต้องต้ ส่งมาใ ส่ ห้ครบ ห้ ---------- */
// strictObject = ถ้าถ้ส่งส่ ฟิลด์ที่ด์ เราไ ที่ ม่รู้ม่ จัรู้ จักมาด้วยด้ ให้ตีห้ กตี ลับลั ไม่ใม่ ช่เช่ มินเฉย มิ
export const createStudentSchema = z.strictObject(
{
...studentFields,
score: studentFields.score.default(0), // ไม่ส่ม่ งมา ส่ = 0
active: studentFields.active.default(true), // ไม่ส่ม่ งมา ส่ = true
},
{ error: "ส่งส่ ฟิลด์ที่ด์ ระบบไ ที่ ม่รู้ม่ จัรู้ จักมาด้วยด้ — ตรวจชื่อชื่ ฟิลด์ใด์ห้ตรง ห้ กับเอกสาร กั " },
);
/* ---------- 3) PATCH /students/:id — ส่งมาแ ส่ ค่ฟิค่ ฟิลด์ที่ด์ จะแ ที่ ก้ ---------- */
export const updateStudentSchema = z
.strictObject(studentFields, {
error: "ส่งส่ ฟิลด์ที่ด์ ระบบไ ที่ ม่รู้ม่ จัรู้ จักมาด้วยด้ — ตรวจชื่อชื่ ฟิลด์ใด์ห้ตรง ห้ กับเอกสาร กั ",
})
.partial() // ทุกทุ ฟิลด์เด์ป็น "ส่งส่ ก็ไก็ด้ ไม่ส่ม่ งส่ ก็ไก็ด้"ด้
.refine((body) => Object.keys(body).length > 0, {
error: "ต้องต้ ส่งอส่ ย่างย่ น้อยห น้ นึ่งนึ่ ฟิลด์ที่ด์ ต้ที่ องการแ ต้ ก้",
});
/* ---------- 4) :id ใน URL — ต้องเ ต้ ป็น UUID ---------- */
export const studentIdParamSchema = z.strictObject({
id: z.uuid("id ต้องเ ต้ ป็น UUID เช่นช่ 3f0c1e8a-... (คัดลอกจากผลของ คั GET /students)"),
});
/* ---------- 5) Query string ของ GET /students ----------
ค่าค่ ที่มาจาก ที่ URL เป็นข้อความ ข้ ล้วนล้ ("2" ไม่ใม่ ช่ 2) ช่ จึงจึต้องใ ต้ ช้ z.coerce ช้ แปลงก่อนตรวจ ก่ */
export const listStudentsQuerySchema = z.object({
page: z.coerce.number({ error: "page ต้องเ ต้ ป็นตัวเลข ตั " }).int().min(1, "page ต้องเ ต้ ริ่มริ่ ที่ 1").default(1),
limit: z.coerce.number({ error: "limit ต้องเ ต้ ป็นตัวเลข ตั " }).int().min(1, "limit ต้องไ ต้ ม่น้ม่ อยก น้ ว่าว่ 1").max(100, "limit สูงสู สุดสุ 100").default(10),
q: z.string().trim().min(1).optional(), // คํา ค้นหา ค้
sort: z.enum(["code", "name", "score", "createdAt"]).default("createdAt"),
order: z.enum(["asc", "desc"]).default("desc"),
});
/* ---------- 6) ให้ TypeScript ห้ ถอดชนิดนิ ข้อข้มูลจาก มู schema เอง ---------- */
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;