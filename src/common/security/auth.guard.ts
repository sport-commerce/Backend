import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request.headers.authorization);

    const jwtPayload = this.validateToken(token);

    request.userSeq = jwtPayload.userSeq;

    return true;
  }

  private extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format.');
    }

    return authHeader.split('Bearer ')[1];
  }

  private validateToken(token: string): any {
    try {
      return this.jwtService.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Token is not valid.');
    }
  }
}
