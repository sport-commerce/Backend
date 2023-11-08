export class User {
  constructor(
    private seq: bigint,
    private email: string,
    private password: string
  ) { }

  getSeq(): Readonly<bigint> {
    return this.seq;
  }

  getEmail(): Readonly<string> {
    return this.email;
  }
}