import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmailController,
  resetPasswordController
} from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  registerUser,
);

router.post(
  '/login',
  loginUser,
);

router.post(
  '/refresh',
  refreshUserSession,
);

router.post(
  '/logout',
  logoutUser,
);

router.post(
  '/request-reset-email',
  requestResetEmailController,
);

// Роут сброса пароля ровно по ТЗ из задания:
router.post(
  '/reset-password',
  resetPasswordController,
);

export default router;
