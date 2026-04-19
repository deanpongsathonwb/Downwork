import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';
import killPort from 'kill-port';

function getListenerPids(port: number): number[] {
  if (process.platform === 'win32') {
    try {
      const out = execSync('netstat -ano', { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      const pids = new Set<number>();
      for (const line of out.split(/\r?\n/)) {
        if (!line.includes('LISTENING')) continue;
        const parts = line.trim().split(/\s+/);
        if (parts.length < 5) continue;
        const localAddr = parts[1];
        const pidStr = parts[parts.length - 1];
        if (!localAddr || !/^\d+$/.test(pidStr)) continue;
        const m = localAddr.match(/:(\d+)$/);
        if (!m || m[1] !== String(port)) continue;
        pids.add(parseInt(pidStr, 10));
      }
      return [...pids];
    } catch {
      return [];
    }
  }

  try {
    const out = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, {
      encoding: 'utf-8',
    }).trim();
    if (!out) return [];
    return [
      ...new Set(
        out
          .split('\n')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => Number.isFinite(n)),
      ),
    ];
  } catch {
    try {
      const out = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();
      if (!out) return [];
      return out
        .split('\n')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n));
    } catch {
      return [];
    }
  }
}

export type FreeDevListenPortOptions = {
  /** When true, no log if the port is already free (second preflight before listen). */
  quietIfIdle?: boolean;
};

/**
 * Stops any process already bound to `port` so this dev server can listen.
 * Development only. Opt out with DEV_SKIP_FREE_PORT=true.
 */
export async function freeDevListenPort(
  port: number,
  logger: Logger,
  options?: FreeDevListenPortOptions,
): Promise<void> {
  const skip = process.env.DEV_SKIP_FREE_PORT;
  if (skip === '1' || skip === 'true') {
    logger.log('Development: port preflight skipped (DEV_SKIP_FREE_PORT is set).');
    return;
  }

  const quietIfIdle = options?.quietIfIdle === true;
  if (!quietIfIdle) {
    logger.log(`Development: checking TCP port ${port}…`);
  }
  const before = getListenerPids(port);
  if (before.length === 0) {
    if (!quietIfIdle) {
      logger.log(`Development: port ${port} is not in use.`);
    }
    return;
  }

  logger.warn(
    `Development: port ${port} is in use (PID(s): ${before.join(', ')}). Requesting termination…`,
  );
  try {
    await killPort(port);
  } catch (err) {
    logger.warn(
      `Development: kill-port reported no listener or could not stop all processes (port ${port}). Continuing; listen() may still fail.`,
    );
    logger.debug(err instanceof Error ? err.message : String(err));
  }

  const after = getListenerPids(port);
  if (after.length > 0) {
    logger.warn(
      `Development: port ${port} still shows listener PID(s): ${after.join(', ')}. Stop them manually or set PORT in .env.`,
    );
  } else {
    logger.log(`Development: port ${port} is clear. Proceeding to listen.`);
  }
}
