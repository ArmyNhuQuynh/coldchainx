import envConfig from "@/schemas/config.schema";

const ABSOLUTE_HTTP_URL_PATTERN = /^https?:\/\//i;

export const resolveFileUrl = (fileUrl: string): string => {
  if (ABSOLUTE_HTTP_URL_PATTERN.test(fileUrl)) {
    return fileUrl;
  }

  return new URL(fileUrl, `${envConfig.VITE_FILE_BASE_URL}/`).toString();
};
