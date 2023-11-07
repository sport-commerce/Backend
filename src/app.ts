import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import { config } from '@/config';
import { CustomError, IErrorResponse } from '@/libs/error-handler';
import { authRouter } from './routes/auth.route';

const PORT = config.DEV_SERVER_PORT!;
const app = express();

// protected-middleware
app.use(
  cookieSession({
    name: 'seesion',
    keys: [config.COOKIE_SECRET_KEY1!, config.COOKIE_SECRET_KEY2!],
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false, // 변경
  })
);
app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: config.DEV_CLIENT_URL!,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// standard-middlware
app.use(compression());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true, limit: '50mb' }));

// route-middleware
app.use('/api/v1', authRouter);

// error-middleware
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res
    .status(404)
    .json({ message: `${req.originalUrl}에 대한 요청은 잘못된 요청입니다.` });

  app.use(
    (
      error: IErrorResponse,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      console.log(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    }
  );
});

app.listen(PORT, () => {
  console.log(`서버가 포트번호 ${PORT}에서 정상작동중입니다.`);
});
