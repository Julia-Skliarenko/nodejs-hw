import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(registerUserSchema), registerUserController);
router.post('/login', celebrate(loginUserSchema), loginUserController);
router.post('/refresh', refreshUserSessionController);
router.post('/logout', logoutUserController);

export default router;
