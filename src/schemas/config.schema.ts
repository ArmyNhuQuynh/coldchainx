import { z } from "zod";

const configSchema = z.object({
  VITE_API_BASE_URL: z.string(),
});

const configProject = configSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
