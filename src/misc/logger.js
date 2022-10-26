import logsService from '@/services/logs';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

async function log(level, ...args) {
  await logsService.create({
    message: args.join(' '),
    level,
  });
}

export default {
  async error(...args) { await log(levels.error, ...args); },
  async warn(...args) { await log(levels.warn, ...args); },
  async info(...args) { await log(levels.info, ...args); },
  async http(...args) { await log(levels.http, ...args); },
  async debug(...args) { await log(levels.debug, ...args); },
};
