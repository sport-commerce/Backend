import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserFactory } from 'src/common/user.factory';
import { IUserRepository } from 'src/user/domain/repository/iuser.repository';
import { CheckNicknameAvailabilityQuery } from './check-nickname-availability.query';

@QueryHandler(CheckNicknameAvailabilityQuery)
export class CheckNicknamevailabilityQueryHandler
  implements IQueryHandler<CheckNicknameAvailabilityQuery, boolean>
{
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(query: CheckNicknameAvailabilityQuery): Promise<boolean> {
    const { nickname } = query;

    const isExists = await this.userRepository.existByNickname(nickname);
    if (isExists) {
      return false;
    }
    return true;
  }
}
