import {
  registerUser as registerUserService,
  loginUser as loginUserService,
  refreshUsersSession,
  logoutUser as logoutUserService,
  createSession,
  setSessionCookies,
} from '../services/auth.js';

export const registerUser = async (req, res) => {
  const user = await registerUserService(req.body);
  const session = await createSession(user._id);

  setSessionCookies(res, session);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const user = await loginUserService(req.body);
  const session = await createSession(user._id);

  setSessionCookies(res, session);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
    res,
  });

  setSessionCookies(res, session);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUserService(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
