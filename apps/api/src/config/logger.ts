import { isProd } from "./environment";

export const loggerOptions = {
  level: isProd ? "info" : "debug",
  redact: {
    paths: [
      // Request headers
      "req.headers.authorization",
      "request.headers.authorization",
      "req.headers.cookie",
      "request.headers.cookie",
      "req.body.password",
      "request.body.password",
      "req.body.credentialClient",
      "request.body.credentialClient",
      "req.body.credentialSecret",
      "request.body.credentialSecret",
      "req.body.apikey",
      "request.body.apikey",
      "response.data.password",
      "response.data.credentialClient",
      "response.data.credentialSecret",
      "response.data.apikey",
      "res.headers.authorization",
      "response.headers.authorization",
      "res.headers.cookie",
      "response.headers.cookie",
    ],
    censor: "*****",
  },
  timestamp: isProd ? () => `,"time":"${new Date().toISOString()}"` : false,
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
};
