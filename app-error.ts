export class AppError extends Error {
/**
* @param statusCode สถานะ HTTP ที่จะตอบก ที่ ลับลั เช่นช่ 404
* @param code รหัสหั ข้อข้ผิดพลาดแบบ ผิ ตัวตัอักษร อั ที่ฝั่ที่ ฝั่

ง client เอาไปเทียบไ ที ด้ เช่นช่ "NOT_FOUND"

* @param message ข้อความอ ข้ ธิบายใ ธิ ห้มห้นุษย์อ่ย์ านอ่
*/
constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    ) {
        super(message);
        this.name = "AppError";
    }
}
// ตัวตัช่วยช่ สั้นสั้ ๆ ที่ใที่ ช้บ่ช้ อยบ่ เพื่อไพื่ ม่ต้ม่ องต้ พิมพิ พ์ตัพ์ วเลข ตั ซ้ํา ทั้งโปรเจก ทั้ ต์
export const notFound = (message: string) => new AppError(404, "NOT_FOUND", message);
export const conflict = (message: string) => new AppError(409, "CONFLICT", message);