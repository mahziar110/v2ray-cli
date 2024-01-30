import http from 'http';
import fs from 'node:fs';
import path from 'node:path';
import fsExtra from 'fs-extra';
import chokidar from 'chokidar';
import { pacDir, globalPacConf, userPacConf } from '../constants/pac';


export function debounce<params extends any[]>(fn: (...args: params) => any, timeout: number) {
  let timer: NodeJS.Timeout;

  return function (this: any, ...args: params) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
}

let server: PacServer | null;

export class PacServer {
  core: http.Server;
  httpPort: number;
  sockPort: number;
  pacPort: number;
  globalPacConf: string;
  userPacConf: string;
  userConfWatcher: fs.FSWatcher | null;
  globalConfWatcher: fs.FSWatcher | null;

  static updateUserPacRules(text: string) {
    return fs.promises.writeFile(userPacConf, text);
  }

  static async getUserPacRules() {
    return await fs.promises.readFile(userPacConf, 'utf8');
  }

  static updateGlobalPacRules(text: string) {
    return fs.promises.writeFile(globalPacConf, text);
  }

  static async getGlobalPacRules() {
    return await fs.promises.readFile(globalPacConf, 'utf8');
  }

  static startPacServer(httpPort: number, sockPort: number, pacPort: number) {
    server?.close();
    server = new PacServer(httpPort, sockPort, pacPort, path.resolve(pacDir, 'proxy.pac'));
  }

  static stopPacServer() {
    server?.close();
  }

  static async generatePacWithoutPort(gfwListText: string) {

    try {
      // remove useless chars
      const rules = JSON.stringify(
        gfwListText
          .replace(/[\r\n]/g, '\n')
          .split('\n')
          .filter((i) => i && i.trim() && i[0] !== '!' && i[0] !== '['),
        null,
        2,
      );
      const data = await fsExtra.readFile(path.resolve(pacDir, 'template.pac'));
      const pac = data.toString('ascii').replace(/__RULES__/g, rules);

      await fsExtra.writeFile(path.resolve(pacDir, 'pac.txt'), pac);
    } catch (err) {
    }
  }

  static async generateFullPac(httpPort: number, socks5Port: number) {

    try {
      const data = await fsExtra.readFile(path.resolve(pacDir, 'pac.txt'));
      const pac = data
        .toString('ascii')
        .replace(/__HTTP__PORT__/g, httpPort.toString())
        .replace(/__SOCKS5__PORT__/g, socks5Port.toString());

      await fsExtra.writeFile(path.resolve(pacDir, 'proxy.pac'), pac);
    } catch (err) {
      console.log(err)
    }
  }

  constructor(httpPort: number, sockPort: number, pacPort: number, pacFile: string) {
    this.httpPort = httpPort;
    this.sockPort = sockPort;
    this.pacPort = pacPort;
    this.core = http.createServer((req, res) => {
      fs.readFile(pacFile, (err, data) => {
        if (err) {
          res.writeHead(500);
        } else {
          res.writeHead(200);
          res.end(data);
        }
      });
    });
    this.core.listen(this.pacPort);
    this.globalPacConf = globalPacConf;
    this.userPacConf = userPacConf;
    this.userConfWatcher = this.watch(this.userPacConf);
    this.globalConfWatcher = this.watch(this.globalPacConf);
  }

  watch(pacFile: string) {
    if (!fs.existsSync(pacFile)) return null;
    return chokidar
      .watch(pacFile, {
        awaitWriteFinish: true,
        usePolling: true,
      })
      .on(
        'change',
        debounce(async () => {
          try {
            const userData = await fs.promises.readFile(pacFile);
            const globalData = await fs.promises.readFile(this.globalPacConf);
            const userText = userData.toString('ascii');
            const globalText = globalData.toString('ascii');
            await PacServer.generatePacWithoutPort(`${userText}\n${globalText}`);
            await PacServer.generateFullPac(this.httpPort, this.sockPort);
            PacServer.stopPacServer();
            PacServer.startPacServer(this.httpPort, this.sockPort, this.pacPort);
          } catch (error) {
            console.log(error);
          }
        }, 1e3),
      );
  }

  unwatch() {
    this.userConfWatcher?.close();
    this.globalConfWatcher?.close();
  }

  close() {
    try {
      this.core.close();
      this.unwatch();
      server = null;
    } catch (error) {
      console.log(error);
    }
  }
}
