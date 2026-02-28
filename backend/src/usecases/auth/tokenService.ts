import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../../config/env";
import { RefreshTokenModel } from "../../infrastructure/database/RefreshTokenModel";
import { hashToken } from "../../utils/crypto";
import { AppError } from "../../middlewares/errorHandler";

const accessTtl = env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"];
const refreshTtl = env.REFRESH_TOKEN_TTL as jwt.SignOptions["expiresIn"];

const signAccessToken = (user: { id: string; role: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: accessTtl,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE
    }
  );
};

const signRefreshToken = (user: { id: string; role: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role, jti: crypto.randomUUID() },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: refreshTtl,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE
    }
  );
};

const getExpiryFromToken = (token: string) => {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) throw new AppError(401, "Invalid refresh token");
  return new Date(decoded.exp * 1000);
};

export const issueTokens = async (user: { id: string; role: string }, ip?: string) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId: user.id,
    tokenHash,
    expiresAt: getExpiryFromToken(refreshToken),
    createdByIp: ip
  });

  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (refreshToken: string, ip?: string) => {
  let payload: any;

  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE
    }) as any;
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);
  const existing = await RefreshTokenModel.findOne({
    tokenHash,
    userId: payload.id
  });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    throw new AppError(401, "Invalid refresh token");
  }

  const accessToken = signAccessToken({ id: payload.id, role: payload.role || "user" });
  const newRefreshToken = signRefreshToken({ id: payload.id, role: payload.role || "user" });
  const newHash = hashToken(newRefreshToken);

  existing.revokedAt = new Date();
  existing.revokedByIp = ip;
  existing.replacedByTokenHash = newHash;
  await existing.save();

  await RefreshTokenModel.create({
    userId: payload.id,
    tokenHash: newHash,
    expiresAt: getExpiryFromToken(newRefreshToken),
    createdByIp: ip
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (refreshToken: string, ip?: string) => {
  const tokenHash = hashToken(refreshToken);
  const existing = await RefreshTokenModel.findOne({ tokenHash });
  if (!existing || existing.revokedAt) return;

  existing.revokedAt = new Date();
  existing.revokedByIp = ip;
  await existing.save();
};
