import { signup } from '@/controllers/auth.controller';
import express from 'express';

export const authRouter = express.Router();

authRouter.post('/users', signup);
