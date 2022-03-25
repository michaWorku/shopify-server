import express from 'express'
import { signout, updatePassword } from '../controllers/authController';
import {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserStats,
    updateMe,
    deleteMe
} from '../controllers/userController'
import { UserRoles } from '../helpers/helpers';
import { ensureAuth } from '../middlewares/ensureAuth';
import { getMe } from '../middlewares/getMe';
import { restrictTo } from '../middlewares/restrictTo';

const router = express.Router({ mergeParams: true });

router.use(ensureAuth);

router.get('/me', getMe, getUser);
router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.post('/signout', signout);

router.use(restrictTo(UserRoles.ADMIN));

router.route(`/`).get(getAllUsers).post(createUser);
router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

router.get('/stats', getUserStats)

export default router