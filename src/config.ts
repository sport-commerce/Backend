import "dotenv/config";

class Config {
  public DEV_CLIENT_URL: string | undefined;
  public DEV_SERVER_PORT: string | undefined;
  public COOKIE_SECRET_KEY1: string | undefined;
  public COOKIE_SECRET_KEY2: string | undefined;

  constructor() {
    this.DEV_CLIENT_URL = process.env.DEV_CLIENT_URL;
    this.DEV_SERVER_PORT = process.env.DEV_SERVER_PORT;
    this.COOKIE_SECRET_KEY1 = process.env.COOKIE_SECRET_KEY1;
    this.COOKIE_SECRET_KEY2 = process.env.COOKIE_SECRET_KEY2;
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`환경변수중 ${key}가 undefined 입니다`);
      }
    }
  }
}

export const config: Config = new Config();
