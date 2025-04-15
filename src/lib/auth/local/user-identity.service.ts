import { use } from "passport";
import { User } from "../../../api/user/user.entity";
import { JWT_SECRET } from "../jwt/jwt-strategy";
import { UserIdentityModel } from "./user-identity.model";
import jwt, { JwtPayload } from 'jsonwebtoken';

const TOKEN_ESPIRES_IN = '30 seconds';
const REFRESHTOKEN_EXPIRES_IN = '10 seconds';

export async function generateTokens(
  user: User,
  oldRefreshToken: string | null = null
): Promise<{ token: string; refreshToken: string }> {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_ESPIRES_IN });
  const refreshToken = jwt.sign(user, JWT_SECRET, { expiresIn: REFRESHTOKEN_EXPIRES_IN });

  const identity = await UserIdentityModel.findOne({ user: user.id });

  if (!identity) {
    throw new Error('User identity not found');
  }

  if (oldRefreshToken && identity.refreshTokens.includes(oldRefreshToken)) {
    const index = identity.refreshTokens.indexOf(oldRefreshToken);
    identity.refreshTokens[index] = refreshToken;
    await UserIdentityModel.findOneAndUpdate(
      { user: user.id, refreshTokens: oldRefreshToken },
      { $set: {'refreshTokens.$': refreshToken} },
      { new: true }
    );
  } else {
    identity.refreshTokens.push(refreshToken);
  }

  await identity.save();

  return {
    token,
    refreshToken
  };
}

export async function resetRefreshToken(user: User, oldRefreshToken: string): Promise<void> {
  await UserIdentityModel.findOneAndUpdate(
    { user: user.id, refreshTokens: oldRefreshToken },
    { $pull: { refreshTokens: oldRefreshToken } }
  );
}

export async function removeExpiredRefreshTokens(user: User): Promise<void> {
  const userIdentity = await UserIdentityModel.findOne({user: user.id});
  
  userIdentity?.refreshTokens.forEach((refreshToken, index) => {
    const payload = jwt.decode(refreshToken) as JwtPayload;
    if (payload.exp && payload.exp < Date.now()) {
      userIdentity.refreshTokens.splice(index, 1);
    }
  });

  await userIdentity?.save();
}