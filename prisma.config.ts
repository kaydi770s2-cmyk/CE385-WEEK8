import "dotenv/config"; // โหลดค่าจาก ค่ .env เข้าข้ process.env ก่อนใ ก่ ช้งาน ช้
import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },

    datasource: {
        url: env("DATABASE_URL"), // อ่านสายเ อ่ ชื่อมชื่ ต่อจาก ต่ .env
    },
});