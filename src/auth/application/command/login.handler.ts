import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IAuthRepository } from 'src/auth/domain/repository/iauth.repository';
import { IUserRepository } from 'src/auth/domain/repository/iuser.repository';
import { JwtPayload } from 'src/jwt/jwt.payload';
import { IJwtService, } from '../adapter/jjwt.service';
import { LoginCommand } from './login.command';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('AuthRepository') private readonly authRepository: IAuthRepository,
    @Inject('JwtService') private readonly jwtService: IJwtService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password, userAgent, ipAddress } = command;

    const userAuth = await this.authRepository.findByEmail(email);

    if (!userAuth) {
      throw new NotFoundException('User authentication information not found.');
    }

    const user = await this.userRepository.findBySeq(userAuth.getUserSeq());

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.validateUserActiveStatus();
    await userAuth.validatePassword(password);

    const tokenPayload: JwtPayload = {
      userSeq: user.getSeq(),
      userRole: user.getRole(),
      signupType: userAuth.getSignupType(),
    };

    const accessToken = this.jwtService.generateToken(tokenPayload);
    const refreshToken = await this.jwtService.generateRefreshToken(tokenPayload, userAgent, ipAddress,);

    return { accessToken, refreshToken };
  }
}
