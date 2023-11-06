import { db } from '@/libs/db';
import { BadRequestError } from '@/libs/error-handler';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import { Request, Response } from 'express';

export const signup = catchAsyncError(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return new BadRequestError('이미 가입된 이메일입니다.');
    }

    const user = await db.user.create({
      data: {
        email,
        password,
      },
    });

    return res.status(201).json({
      message: '회원가입 성공',
      data: user,
    });
  } catch (error) {
    console.log('[SIGNUP_ERROR]: ', error);
    return res.status(500).json({
      message: 'Internal Server Error,,,',
      data: null,
    });
  }
});
