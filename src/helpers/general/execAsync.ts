import { exec, ExecOptions } from 'child_process';
import * as net from 'net';

export const execAsync = (command: string, options?: ExecOptions) => {
  return new Promise<{
    code: number;
    stdout?: string;
    stderr?: string;
  }>((resolve, reject) => {
    exec(command, { ...options, windowsHide: true }, (err, stdout, stderr) => {
      if (!stderr) {
        resolve({
          code: err ? 1 : 0,
          stdout,
        });
      } else {
        reject({
          code: err ? 1 : 0,
          stderr,
        });
      }
    });
  });
};
