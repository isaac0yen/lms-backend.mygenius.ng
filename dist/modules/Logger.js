import fs from 'fs';
import { DateTime } from 'luxon';
import path from 'path';
const Logger = {
    logDir: 'logs',
    levels: ['info', 'warn', 'error'],
    format: null,
    dateFormat: 'yyyy-LL-dd',
    maxFiles: 30,
    filePrefix: '',
    fileSuffix: '',
    init(options = {}) {
        this.logDir = options.logDir || 'logs';
        this.levels = options.levels || ['info', 'warn', 'error'];
        this.format = options.format || this.defaultFormat.bind(this);
        this.dateFormat = options.dateFormat || 'yyyy-LL-dd';
        this.maxFiles = options.maxFiles || 30;
        this.filePrefix = options.filePrefix || '';
        this.fileSuffix = options.fileSuffix || '';
    },
    log(level, message, content) {
        if (!this.levels.includes(level)) {
            throw new Error(`Invalid log level: ${level}`);
        }
        const logContent = typeof content === 'object'
            ? content
            : { message: this.safeStringify(content) };
        const timestamp = DateTime.now()
            .setZone('Africa/Lagos')
            .toFormat('yyyy-LL-dd HH:mm:ss');
        const stackLine = new Error().stack.split('\n')[3];
        const lineNumber = stackLine.split(':')[1];
        const filePath = stackLine.split('(')[1].split(':')[0];
        const logEntry = this.format(level, message, logContent, timestamp, filePath, lineNumber);
        const logFileName = `${this.filePrefix}${DateTime.now().toFormat(this.dateFormat)}${this.fileSuffix}.log`;
        const logFilePath = path.join(this.logDir, level, logFileName);
        if (!fs.existsSync(path.dirname(logFilePath))) {
            fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
        }
        fs.appendFileSync(logFilePath, logEntry, 'utf-8');
        this.rotateLogFiles(level);
    },
    rotateLogFiles(level) {
        const logLevelDir = path.join(this.logDir, level);
        const files = fs.readdirSync(logLevelDir);
        if (files.length > this.maxFiles) {
            const oldestFile = files.sort()[0];
            const oldestFilePath = path.join(logLevelDir, oldestFile);
            fs.unlinkSync(oldestFilePath);
        }
    },
    defaultFormat(level, message, content, timestamp, filePath, lineNumber) {
        return `[${level.toUpperCase()}] [${timestamp}] [File: ${filePath} ] [Line: ${lineNumber} ]\n${message}\n\n${this.safeStringify(content, 2)}\n\n`;
    },
    safeStringify(obj, indent = 2) {
        let cache = [];
        const result = JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) {
                    return undefined;
                }
                cache.push(value);
            }
            return value;
        }, indent);
        cache = null;
        return result;
    },
    info(message, content) {
        this.log('info', message, content);
        console.log('\x1b[34m', message, '\x1b[0m');
    },
    warn(message, content) {
        this.log('warn', message, content);
        console.log('\x1b[33m', message, '\x1b[0m');
    },
    error(message, content) {
        this.log('error', message, content);
        console.log('\x1b[31m', message, content, '\x1b[0m');
    },
};
export default Logger;
