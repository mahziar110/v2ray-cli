import { ConnectionType } from '../types/connection_type'

type VlessType = Partial<{
  id: string,
  address: string,
  port: number,
  remark: string,
  encryption: string,
  security: string,
  sni: string,
  type: ConnectionType,
  host: string,
  path: string,
  flow: string,
  seed: string,
  pbk: string,
  sid: string,
  fp: string,
  headerType: string
}>;

export class Vless {
  constructor(config_uri: string) {
    console.log(this.parseVless(config_uri));
  }

  private parseVless(uri: string) {
    const [address, port] = uri.includes('?')
    ? uri.slice(8).split('?')[0].split(':')
    : uri.slice(8).split('#')[0].split(':');

    const url = new URLSearchParams(uri.slice(8).split('?')[1].split('#')[0]);
    const config: VlessType = {
      id: address.split('@')[0],
      address: address.split('@')[1],
      port: parseInt(port),
      remark: uri.split('#')[1],
      encryption: url.get('encryption') ?? '',
      security: url.get('security') ?? '',
      sni: url.get('sni') ?? '',
      type: (url.get('type') ?? 'tcp') as ConnectionType,
      host: url.get('host') ?? '',
      path: url.get('path') ?? '',
      flow: url.get('flow') ?? '',
      seed: url.get('seed') ?? '',
      pbk: url.get('pbk') ?? '',
      sid: url.get('sid') ?? '',
      fp: url.get('fp') ?? '',
      headerType: url.get('headerType') ?? ''
    }

    return config;
  }
}