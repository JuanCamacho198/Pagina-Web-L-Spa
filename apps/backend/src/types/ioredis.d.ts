declare module 'ioredis' {
  interface Redis {
    ping(): Promise<string>;
    quit(): Promise<'OK'>;
    pipeline(): Pipeline;
  }

  interface Pipeline {
    zremrangebyscore(key: string, min: number, max: number): Pipeline;
    zadd(key: string, score: number, member: string): Pipeline;
    zcard(key: string): Pipeline;
    expire(key: string, seconds: number): Pipeline;
    exec(): Promise<Array<[Error | null, unknown]>>;
  }

  interface RedisOptions {
    host?: string;
    port?: number;
    password?: string;
    lazyConnect?: boolean;
    maxRetriesPerRequest?: number;
  }

  export default class Redis {
    constructor(options?: RedisOptions | string);
    ping(): Promise<string>;
    quit(): Promise<'OK'>;
    pipeline(): Pipeline;
  }
}