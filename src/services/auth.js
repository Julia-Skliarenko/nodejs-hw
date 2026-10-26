import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { sendMail } from '../utils/sendMail.js';
import { getTemplate } from '../utils/handlebars.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const setSessionCookies = (res, session) => {
  const commonOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...commonOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...commonOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    ...commonOptions,
    maxAge: ONE_DAY,
  });
};

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  return user;
};

export const refreshUsersSession = async ({ sessionId, refreshToken, res }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    await Session.deleteOne({ _id: sessionId });
    if (res) {
      res.clearCookie('sessionId');
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await createSession(session.userId);
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;

  const html = await getTemplate('reset-password-email', {
    name: user.name,
    resetLink,
  });

  try {
    await sendMail({
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });
};
