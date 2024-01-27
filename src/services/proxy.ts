import { ProxyMode } from '../types';
import { execAsync } from '../helpers/general/execAsync';
import { PacServer } from './PacProxy';

export default class ProxyService {
  private httpPort: number;
  private socksPort: number;
  private pacPort: number;
  private mode: ProxyMode;

  constructor(
    httpPort: number,
    socksPort: number,
    pacPort: number,
    mode: ProxyMode
  ) {
    this.httpPort = httpPort;
    this.socksPort = socksPort;
    this.pacPort = pacPort;
    this.mode = mode;
  }

  public async start() {
    if (this.mode === 'PAC')
      await this.setPacProxy();
    PacServer.startPacServer(this.httpPort, this.socksPort, this.pacPort);
  }

  private unsetProxy = async () => {
    const res = await execAsync('gsettings set org.gnome.system.proxy mode none');
    return res.code === 0;
  }

  private setPacProxy = async () => {
    const url = `http://127.0.0.1:${this.pacPort ?? 1090}/proxy.pac`;
    const autoSet = await execAsync('gsettings set org.gnome.system.proxy mode auto');
    const urlSet = await execAsync(`gsettings set org.gnome.system.proxy autoconfig-url '${url}'`);
    return autoSet.code === 0 && urlSet.code === 0;
  }

  private startPacProxy = async () => {
    
  }
}