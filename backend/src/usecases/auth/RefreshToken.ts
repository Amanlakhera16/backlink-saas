import { rotateRefreshToken, revokeRefreshToken } from "./tokenService";

export const refreshAccessToken = async (refreshToken: string, ip?: string) => {
  return rotateRefreshToken(refreshToken, ip);
};

export const logoutRefreshToken = async (refreshToken: string, ip?: string) => {
  return revokeRefreshToken(refreshToken, ip);
};
