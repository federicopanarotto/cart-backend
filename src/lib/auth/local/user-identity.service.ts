import { User } from "../../../api/user/user.entity";
import { JWT_SECRET } from "../jwt/jwt-strategy";
import { UserIdentityModel } from "./user-identity.model";
import jwt from 'jsonwebtoken';

export async function generateTokens(
  user: User,
  oldRefreshToken: string | null = null
): Promise<{ token: string; refreshToken: string }> {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '10 seconds' });
  const refreshToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1 minutes' });

  const identity = await UserIdentityModel.findOne({ user: user.id });

  if (!identity) {
    throw new Error('User identity not found');
  }

  if (oldRefreshToken && identity.refreshTokens.includes(oldRefreshToken)) {
    const index = identity.refreshTokens.indexOf(oldRefreshToken);
    identity.refreshTokens[index] = refreshToken;
    await UserIdentityModel.findOneAndUpdate(
      {user: user.id, refreshTokens: oldRefreshToken },
      { $set: {'refreshTokens.$': refreshToken} },
      { new: true }
    );
    console.log('aggiornato');
  } else {
    identity.refreshTokens.push(refreshToken);
    console.log('aggiunto');
  }

  await identity.save();

  return {
    token,
    refreshToken
  };
}

export async function resetRefreshToken(user: User, oldRefreshToken: string): Promise<void> {
  await UserIdentityModel.findOneAndDelete(
    {user: user.id, refreshTokens: oldRefreshToken },
    { $pull: { refreshTokens: oldRefreshToken } }
  );
}