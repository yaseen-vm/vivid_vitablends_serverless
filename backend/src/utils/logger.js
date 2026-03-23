import log from 'loglevel';
import config from '../config/index.js';

// Set default log level based on environment
const level = config.nodeEnv === 'production' ? 'warn' : 'info';
log.setLevel(level);

// Create a wrapper to match the previous Winston API
const logger = {
  info: (message, meta = {}) => {
    log.info(message, Object.keys(meta).length ? meta : '');
  },
  warn: (message, meta = {}) => {
    log.warn(message, Object.keys(meta).length ? meta : '');
  },
  error: (message, meta = {}) => {
    log.error(message, Object.keys(meta).length ? meta : '');
  },
  debug: (message, meta = {}) => {
    log.debug(message, Object.keys(meta).length ? meta : '');
  },
};

export default logger;
