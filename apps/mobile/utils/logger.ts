/**
 * Global Dev Logger for Arteria.
 * 
 * Future AI Assistants: ALWAYS use this logger instead of raw console.log.
 * This ensures dev logs are structured, easily filtered, and future-proofed 
 * to be piped directly into a "Debug Screen" or external logging service.
 * 
 * Usage:
 *   import { logger } from '@/utils/logger';
 *   logger.info('Engine', 'Calculated 45 ticks offline', { ticks: 45 });
 *   logger.warn('Save', 'Recovered from corrupted state');
 *   logger.error('UI', 'Crash during combat render', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogModule = 'Engine' | 'UI' | 'Redux' | 'Save' | 'Dev' | 'Analytics';

class Logger {
    private isDev: boolean = __DEV__;

    private format(level: LogLevel, module: LogModule, message: string): string {
        const time = new Date().toISOString().split('T')[1].slice(0, 8); // HH:mm:ss
        return `[Arteria] ${time} [${module}] [${level.toUpperCase()}] ${message}`;
    }

    public debug(module: LogModule, message: string, data?: any) {
        if (!this.isDev) return;
        const msg = this.format('debug', module, message);
        if (data) console.debug(msg, data);
        else console.debug(msg);
    }

    public info(module: LogModule, message: string, data?: any) {
        if (!this.isDev) return;
        const msg = this.format('info', module, message);
        if (data) console.info(msg, data);
        else console.info(msg);
    }

    public warn(module: LogModule, message: string, data?: any) {
        // Output warnings even in prod, standard practice for tracing
        const msg = this.format('warn', module, message);
        if (data) console.warn(msg, data);
        else console.warn(msg);
    }

    public error(module: LogModule, message: string, data?: any) {
        // Output errors even in prod
        const msg = this.format('error', module, message);
        if (data) console.error(msg, data);
        else console.error(msg);
    }
}

export const logger = new Logger();
