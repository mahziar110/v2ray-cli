import path from 'node:path';
import os from 'node:os';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { File } from '../helpers/general/File';

const dataFilesPath = '/usr/share/v2ray-cli'
const corePath = `${dataFilesPath}/v2ray`;
const adjectiveConfigPath = `${os.homedir()}/v2raycli/adj.json`;

export default class V2rayService {
  v2ray?: ChildProcessWithoutNullStreams | null;
  status: boolean = false;
  config?: JSON;
  constructor(configuration: JSON) {
    new File(adjectiveConfigPath).write(configuration);
    // TODO: logger
  }

  start() {
    if (this.status) return;
    try {
    this.v2ray = spawn(corePath, ['run', '-c', adjectiveConfigPath]);
    this.v2ray?.stdout.on('data', (data: string) => {
      console.log(data.toString());
    });
    this.v2ray?.on('close', (code: string) => {
      console.log(code.toString());
    })
    this.status = true;
    } catch (err) {
      console.log(err);
    }
  }

  stop() {
    this.v2ray?.kill();
    console.log('send kill');
  }

  check() {
    return this.status;
  }
}