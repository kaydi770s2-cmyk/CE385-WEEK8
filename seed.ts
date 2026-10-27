import { prisma } from "../src/lib/prisma.js";

const students = [
{ code: "66010001", name: "สมชาย ใจดี", email: "somchai@dpu.ac.th", score: 78 },
{ code: "66010002", name: "สมหญิงญิ รักเรียน", email: "somying@dpu.ac.th", score: 92 },
{ code: "66010003", name: "วีรภาพ ตั้งใจ ", email: "weeraphap@dpu.ac.th", score: 65 },
{ code: "66010004", name: "ปรียารี ขยันทํา ", email: "preeya@dpu.ac.th", score: 88 },
{ code: "66010005", name: "ธนกร ไม่ยอมแพ้", email: "thanakorn@dpu.ac.th", score: 54, active: false },
];

async function main() {
    // ล้างของเ ล้ ก่าก่ ก่อนก่ เพื่อใ พื่ ห้รัห้รัน seed ซ้ํา ได้เด้รื่อยรื่ ๆ ผลลัพลั ธ์เหธ์ มือนมื กันกั ทุกคทุ รั้งรั้
    await prisma.student.deleteMany();
    // skipDuplicates: ถ้าเจอ ถ้ code หรือรื email ซ้ํา ให้ข้ห้ ามไป ข้ ไม่ต้ม่ องต้ ล้มล้
    const result = await prisma.student.createMany({ data: students, skipDuplicates: true });
    console.log(`เพิ่มพิ่ ข้อข้มูลมู นักศึกษาแ ศึ ล้วล้ ${result.count} คน`);
}

main().catch((error) => { console.error("seed ไม่สําม่ สํา เร็จ:", error.message)});