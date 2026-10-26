import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import { updateUserAvatar } from '../controllers/userController.js';

const router = Router();

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updateUserAvatar),
);

export default router;
