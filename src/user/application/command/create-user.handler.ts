import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/user/domain/repository/iuser.repository';
import { UserFactory } from 'src/user/domain/user.factory';
import { CreateUserCommand } from './create-user.command';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, password } = command;

    const userExist = await this.userRepository.findByEmail(email);
    if (userExist) {
      throw new UnprocessableEntityException('이미 등록된 이메일 주소입니다.');
    }

    const newUser = await this.userRepository.save(email, password);

    this.userFactory.create(newUser.getSeq(), email, password);
  }
}
