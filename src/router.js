import { Router } from 'express';
import Database from './database/index';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import CollaboratorController from './app/controllers/CollaboratorController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

// routes.get('/', async (req, res) => {
//   const user = await User.create({
//     name: 'Beatriz',
//     email: 'beatiz@dev.com',
//     password_hash: '123456',
//   });
//   return res.json(user);
// });

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Authenticated Routes
routes.use(authMiddleware);
routes.put('/users', UserController.update);

// Schedules Route
routes.post('/appointments', AppointmentController.store);

// Get all Appointments
routes.get('/appointments', AppointmentController.index);

// Get all Collaborators (Users - Provider:true)
routes.get('/collaborators', CollaboratorController.index);

// Get all Appointments by collaborator
routes.get('/schedules', ScheduleController.index);

// Get all Notifications
routes.get('/notifications', NotificationController.index);

// Mark Notifications as read
routes.put('/notifications/:id', NotificationController.update);

// File Upload Routes
routes.post('/files', upload.single('file'), FileController.store);

export default routes;