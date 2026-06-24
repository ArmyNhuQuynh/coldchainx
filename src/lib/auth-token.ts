import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string, bufferSeconds = 30): boolean => {
  try {
    const decodedToken = jwtDecode(token) as { exp?: number };

    if (!decodedToken.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime + bufferSeconds;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
