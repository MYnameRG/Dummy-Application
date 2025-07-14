import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import UserRoutes from './UserRoutes';


/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

const versionRouter = Router();

// ** Add UserRouter ** //

// Init router
const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);
userRouter.get(Paths.Users.Chat, UserRoutes.chat);
userRouter.get(Paths.Users.Load, UserRoutes.load);

// Add version Router to specific feature
versionRouter.use(Paths.Version, apiRouter);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default versionRouter;
