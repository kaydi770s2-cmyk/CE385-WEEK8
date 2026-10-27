import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validate } from "../middlewares/validate.js";
import {
createStudentSchema, listStudentsQuerySchema, studentIdParamSchema, updateStudentSchema,
type CreateStudentInput, type ListStudentsQuery, type UpdateStudentInput,
} from "../schemas/student.schema.js";
import * as studentService from "../services/student.service.js";
export const studentsRouter = Router();
/* ---------- GET / → อ่านหลายรายการ อ่ ---------- */
studentsRouter.get(
"/",
validate({ query: listStudentsQuerySchema }),
asyncHandler(async (_req, res) => {
const query: ListStudentsQuery = res.locals["valid"].query;
const result = await studentService.listStudents(query);
res.status(200).json(result); // 200 OK + { data, meta }
}),
);
/* ---------- GET /:id → อ่านรายการเ อ่ ดียวดี ---------- */
studentsRouter.get(
"/:id",
validate({ params: studentIdParamSchema }),
asyncHandler(async (_req, res) => {
const { id } = res.locals["valid"].params as { id: string };
const student = await studentService.getStudentById(id);
res.status(200).json({ data: student });
}),
);
studentsRouter.post(
"/",
validate({ body: createStudentSchema }),
asyncHandler(async (_req, res) => {
const input: CreateStudentInput = res.locals["valid"].body;
const created = await studentService.createStudent(input);
// 201 Created + header Location ชี้ไปชี้ ที่ของให ที่ ม่ที่ม่ เที่ พิ่งสพิ่ ร้างร้
// นี่คืนี่ อธรรมเ คื นียมของ นี REST ที่คนที่ ลืมลื บ่อยบ่ ที่สุที่ ดสุ
res.status(201).location(`/api/v1/students/${created.id}`).json({ data: created });
}),
);
/* ---------- PATCH /:id → แก้บาง ก้ ฟิลด์ ---------- */
studentsRouter.patch(
"/:id",
validate({ params: studentIdParamSchema, body: updateStudentSchema }),
asyncHandler(async (_req, res) => {
const { id } = res.locals["valid"].params as { id: string };
const input: UpdateStudentInput = res.locals["valid"].body;
const updated = await studentService.updateStudent(id, input);
res.status(200).json({ data: updated });
}),
);
/* ---------- DELETE /:id → ลบ ---------- */
studentsRouter.delete(
"/:id",
validate({ params: studentIdParamSchema }),
asyncHandler(async (_req, res) => {
const { id } = res.locals["valid"].params as { id: string };
await studentService.deleteStudent(id);
// 204 No Content — ลบสํา เร็จแล้วไล้ ม่มีม่ อะไรจะ มี ส่งกส่ ลับลั
// ห้ามใ ห้ ส่ body ส่ ใน 204 (ผิดมาตรฐาน ผิ HTTP) จึงใจึ ช้ .end() ช้ ไม่ใม่ ช่ .json() ช่
res.status(204).end();
}),
);