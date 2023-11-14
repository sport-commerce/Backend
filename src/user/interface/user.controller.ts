import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/command/create-user.command';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { email, password } = dto;

    const command = new CreateUserCommand(email, password);

    await this.commandBus.execute(command);
  }
}