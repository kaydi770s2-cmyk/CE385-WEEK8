import { prisma } from "../lib/prisma.js";
import { notFound } from "../errors/app-error.js";
import type { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from "../schemas/student.schema.js";
/* ---------- R: อ่านหลายรายการ อ่ + แบ่งหบ่ น้าน้ + ค้นหา ค้ + เรียงรี ---------- */
export async function listStudents(query: ListStudentsQuery) {
const { page, limit, q, sort, order } = query;
// where ว่างว่ = ไม่กรองอะไร ม่ · mode: "insensitive" = ไม่สนม่ ตัวตัพิมพิ พ์เพ์ล็กใหญ่
const where = q
? {
OR: [
{ name: { contains: q, mode: "insensitive" as const } },
{ email: { contains: q, mode: "insensitive" as const } },
{ code: { contains: q } },
],
}
: {};
// ยิงสอง ยิ คํา ถามพร้อมร้ กันกั — Promise.all จากสัปดา สั ห์ที่ห์ 4 ที่ ได้ใด้ช้จช้ริงริที่นี่ที่ นี่
const [rows, total] = await Promise.all([
prisma.student.findMany({
where,
orderBy: { [sort]: order },
skip: (page - 1) * limit, // ข้ามของห ข้ น้าน้ก่อนก่ ๆ
take: limit, // เอามาแค่เค่ ท่าท่ ที่ขอที่
}),
prisma.student.count({ where }),
]);
return { data: rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
/* ---------- R: อ่านรายการเ อ่ ดียวดี ---------- */
export async function getStudentById(id: string) {
const student = await prisma.student.findUnique({ where: { id } });
// findUnique ไม่โยน ม่ error เมื่อหาไ มื่ ม่เจอ ม่ — มันมั คืนคื null เฉย ๆ
// เราจึงจึต้องแปลง ต้ null เป็นข้อข้ผิดพลาด ผิ ที่มีที่ ความหมายเอง มี
if (!student) throw notFound(`ไม่พบม่ นักศึกษา ศึ id ${id}`);
return student;
}

export async function createStudent(input: CreateStudentInput) {
// ถ้าถ้ code หรือรื email ซ้ํา Prisma จะโยน P2002 ออกมา
// เราปล่อยใ ล่ ห้มัห้นลอย มั ขึ้นไป ขึ้ ถึงถึ error-handler ซึ่งแปลงเ ซึ่ ป็น 409 ให้เอง ห้
return prisma.student.create({ data: input });
}
/* ---------- U: แก้บาง ก้ ฟิลด์ ---------- */
export async function updateStudent(id: string, input: UpdateStudentInput) {
// แถวไม่มีม่ อมี ยู่ → Prisma ยู่ โยน P2025 → error-handler แปลงเป็น 404
return prisma.student.update({ where: { id }, data: input });
}
/* ---------- D: ลบ ---------- */
export async function deleteStudent(id: string) {
await prisma.student.delete({ where: { id } });
}