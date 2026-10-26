import {
  createSession,
  setSessionCookies,
  registerUser as registerUserService,
  loginUser as loginUserService,
  refreshUsersSession,
  logoutUser as logoutUserService,
  requestResetToken,
  resetPassword
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
  const user = await loginUserService(req.body);

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an auth user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSession = async (req, res) => {
  const session = await refreshUsersSession({
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

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Password reset email sent successfully',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password reset successfully',
    data: {},
  });
};
