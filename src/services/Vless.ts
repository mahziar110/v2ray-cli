import { inbounds } from '../constants/v2ray';
import { ConnectionType, StreamSettings } from '../types'

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

interface StreamSettingsInterface {
  tcpSettings: {};
  kcpSettings: {};
  httpSettings: {}
  quicSettings: {};
  dsSettings: {};
  grpcSettings: {};
  wsSettings: {};
  realitySettings: {};
  xtlsSettings: {};
  tlsSettings: {};
  security: {};
  network: {};
  [key: string]: any;
};


export class Vless {
  config: VlessType;
  settings = {};
  streamSettings: StreamSettingsInterface = {
    tcpSettings: {},
    kcpSettings: {},
    httpSettings: {},
    quicSettings: {},
    dsSettings: {},
    grpcSettings: {},
    wsSettings: {},
    realitySettings: {},
    xtlsSettings: {},
    tlsSettings: {},
    security: 'none',
    network: '',
  };

  streamSettingsTemplate: StreamSettings = {
    tcpSettings: {
      acceptProxyProtocol: false,
      header: {
        type: 'none',
      },
    },
    kcpSettings: {
      header: {
        type: '',
      },
      mtu: 1350,
      congestion: false,
      tti: 20,
      uplinkCapacity: 50,
      writeBufferSize: 1,
      readBufferSize: 1,
      downlinkCapacity: 20,
    },
    httpSettings: {
      path: '',
      host: [''],
    },
    quicSettings: {
      key: '',
      header: {
        type: 'utp',
      },
    },
    dsSettings: {
      path: '',
    },
    grpcSettings: {
      initial_windows_size: 0,
      health_check_timeout: 60,
      multiMode: true,
      idle_timeout: 60,
      serviceName: '',
      permit_without_stream: false,
      user_agent: '',
    },
    wsSettings: {
      path: '',
      headers: {
        host: '',
      },
    },
    realitySettings: {
      spiderX: '',
      publicKey: '',
      show: true,
      serverName: '',
      shortId: '',
      fingerprint: '',
    },
    xtlsSettings: {
      serverName: '',
      allowInsecure: true,
      fingerprint: '',
    },
    tlsSettings: {
      serverName: '',
      allowInsecure: true,
    },
    security: 'none',
    network: 'tcp',
  };
  private outbound = {};

  constructor(config_uri: string) {
    this.config = this.parseVless(config_uri);
    this.setOutbound();
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
      encryption: url.get('encryption') || '',
      security: url.get('security') || '',
      sni: url.get('sni') || '',
      type: (url.get('type') || 'tcp') as ConnectionType,
      host: url.get('host') || '',
      path: url.get('path') || '',
      flow: url.get('flow') || '',
      seed: url.get('seed') || '',
      pbk: url.get('pbk') || '',
      sid: url.get('sid') || '',
      fp: url.get('fp') || '',
      headerType: url.get('headerType') || ''
    }

    return config;
  }

  private setOutbound() {
    const streamType: ConnectionType = this.config.type || 'tcp';
    const item = `${streamType === 'h2' ? 'http' : streamType}Settings`;

    this.streamSettings[item] = this.streamSettingsTemplate[item];

    this.streamSettings.security = this.config.security || 'none';
    this.streamSettings.network = streamType as string;

    this.settings = {
      vnext: [
        {
          address: this.config.address || '',
          users: [
            {
              id: this.config.id || '',
              level: 0,
              encryption: this.config.encryption || 'none',
              flow: this.config.flow || '',
            },
          ],
          port: Number(this.config.port) || 443,
        },
      ]
    };

    this.streamSettings.tlsSettings = {
      allowInsecure: true,
      serverName: this.config.sni ?? this.config.host ?? '',
      fingerprint: this.config.fp ?? 'chrome',
    };
    switch (this.config.type) {
      case 'h2':
        // @ts-ignore defined
        this.streamSettings.httpSettings.host = [host];
        // @ts-ignore defined
        this.streamSettings.httpSettings.path = path;
        break;
      case 'ws':
        // @ts-ignore defined
        this.streamSettings.wsSettings.path = path;
        // @ts-ignore defined
        this.streamSettings.wsSettings.headers = {
          host: this.config.host ?? '',
        };
        break;
      case 'grpc':
        // @ts-ignore defined
        this.streamSettings.grpcSettings.serviceName = this.config.path;
        // @ts-ignore defined
        this.streamSettings.grpcSettings.multiMode = this.config.type === 'multi';
        break;
      case 'tcp':
        this.streamSettings.tcpSettings = {
          acceptProxyProtocol: false,
          header: {
            type: this.config.type,
          },
        };
        break;
      case 'kcp':
        this.streamSettings.kcpSettings = {
          header: {
            type: this.config.type,
          },
          mtu: 1350,
          congestion: false,
          tti: 20,
          uplinkCapacity: 50,
          writeBufferSize: 1,
          readBufferSize: 1,
          downlinkCapacity: 20,
        };
        break;
    }
    switch (this.config.security) {
      case 'reality':
        this.streamSettings.realitySettings = {
          spiderX: '',
          publicKey: this.config.pbk,
          show: true,
          serverName: this.config.sni,
          shortId: this.config.sid,
          fingerprint: this.config.fp,
        };
        break;
      case 'xtls':
        this.streamSettings.xtlsSettings = {
          serverName: this.config.address,
          allowInsecure: true,
          fingerprint: this.config.fp,
        };
        break;
    }

    this.outbound = {
      streamSettings: this.streamSettings as StreamSettings,
      settings: this.settings,
      inbounds: inbounds
    }
  }

  public getOutbound() {
    return this.outbound;
  }
}
