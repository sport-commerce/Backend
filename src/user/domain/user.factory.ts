import { Injectable } from '@nestjs/common';
import { User } from './user';

import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  create(seq: bigint, email: string, password: string): User {
    const user = new User(seq, email, password);

    this.eventBus.publish(new UserCreatedEvent(email));

    return user;
  }

  reconstitute(seq: bigint, email: string, password: string): User {
    return new User(seq, email, password);
  }
}