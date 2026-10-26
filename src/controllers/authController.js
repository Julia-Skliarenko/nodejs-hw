import {
  createSession,
  setSessionCookies,
  registerUser as registerUserService,
  loginUser as loginUserService,
  refreshUserSession as refreshUserSessionService,
  logoutUser as logoutUserService,
  requestResetToken,
  resetPassword as resetPasswordService,
} from '../services/auth.js';

export const registerUser = async (req, res) => {
  const newUser = await registerUserService(req.body);

  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};

export const loginUser = async (req, res) => {
  const { user, session } = await loginUserService(req.body);

  setSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an auth user!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const refreshUserSession = async (req, res) => {
  const session = await refreshUserSessionService({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
    res,
  });

  setSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
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

export const requestResetEmail = async (req, res) => {
  await requestResetToken(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Password reset email sent successfully',
    data: {},
  });
};

export const resetPassword = async (req, res) => {
  await resetPasswordService(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password reset successfully',
    data: {},
  });
};
