import winston from 'winston';

winston.cli();
winston.default.transports.console.level = 'debug';
winston.default.transports.console.timestamp = true;

export default winston;
