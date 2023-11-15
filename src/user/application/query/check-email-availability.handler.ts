import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserFactory } from 'src/common/user.factory';
import { IUserRepository } from 'src/user/domain/repository/iuser.repository';
import { CheckEmailAvailabilityQuery } from './check-email-availability.query';

@QueryHandler(CheckEmailAvailabilityQuery)
export class CheckEmailAvailabilityQueryHandler
  implements IQueryHandler<CheckEmailAvailabilityQuery, boolean>
{
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(query: CheckEmailAvailabilityQuery): Promise<boolean> {
    const { email } = query;

    const isExists = await this.userRepository.existByEmail(email);
    if (isExists) {
      return false;
    }
    return true;
  }
}
