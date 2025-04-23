import { User } from "../../api/user/user.entity";
import { JWT_SECRET } from "./jwt/jwt-strategy";
import { UserIdentityModel } from "./local/user-identity.model";
import jwt, { JwtPayload } from 'jsonwebtoken';

const TOKEN_ESPIRES_IN = '10 seconds';
const REFRESHTOKEN_EXPIRES_IN = '2 hours';

export async function verifyMatch(userId: string, token: string): Promise<boolean> {
  return !!(await UserIdentityModel.exists({user: userId, refreshTokens: token}));
}

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

  if (oldRefreshToken && identity.refreshTokens?.includes(oldRefreshToken)) {
    const index = identity.refreshTokens.indexOf(oldRefreshToken);
    identity.refreshTokens[index] = refreshToken;
    await UserIdentityModel.findOneAndUpdate(
      { user: user.id, refreshTokens: oldRefreshToken },
      { $set: {'refreshTokens.$': refreshToken} },
      { new: true }
    );
  } else {
    console.log('PUSHONE');
    identity.refreshTokens?.push(refreshToken);
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
  
  if (userIdentity?.refreshTokens) {
    userIdentity?.refreshTokens?.forEach((refreshToken, index) => {
      const payload = jwt.decode(refreshToken) as JwtPayload;
      if (payload.exp && payload.exp < Date.now()) {
        console.log(payload.exp);
        userIdentity.refreshTokens = userIdentity.refreshTokens?.filter((_, i) => i !== index);
      }
    });
  }

  await userIdentity?.save();
}