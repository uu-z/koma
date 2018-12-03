import { ConnectionOptions } from "mongoose";
import { RedisOptions } from "ioredis";
import bodyParser = require("body-parser");

export interface KomaConfig {
  RUN?: boolean;
  IS_PROD?: string;
  NODE_ENV?: string;
  HOST?: string;
  PORT?: number;
  ES_HOST?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  MONGO_URL?: string;
  MONGO_DATABASE?: string;
  KUE_PORT?: number;
  JWT?: {
    SECRET?: string;
    EXP?: number;
    passthrough?: boolean;
  };
  ES?: {
    options?: {
      host?: string;
    };
  };
  CORS?: { origin?: string };
  GRAPHQL?: {
    genSchemaFromMongoose?: boolean;
  };
  MONGOOSE?: {
    dburl?: string;
    plugins?: {
      [key: string]: object;
    };
    options?: ConnectionOptions;
  };
  REDIS?: {
    options?: RedisOptions;
  };
  KUE?: {
    options?: {};
  };
  REDIS_CACHE?: {
    redis?: {
      host?: string;
      port?: number;
    };
    onerror?: Function;
  };
  BODY_PARSER?: bodyParser.Options;
  HELMET?: object;
}

export interface KomaUse {
  start?: {
    metas?: {
      [key: string]: {
        load?: boolean;
      };
    };
    load?: {
      plugins?: string[];
      modules?: string[];
    };
    config?: KomaConfig;
  };
}

export interface koma {
  $use(data: KomaUse): koma;
  config: KomaConfig;
}

export const koma: koma;
