type SniffingObject = {
  enabled: boolean;
  destOverride: string[];
  metadataOnly: boolean;
};

type AllocateObject = {
  strategy: string;
  refresh: number;
  concurrency: number;
};

type TcpObject = {
  acceptProxyProtocol: boolean;
  header: {
    type: string;
  };
};

type KcpObject = {
  mtu: number;
  tti: number;
  uplinkCapacity: number;
  downlinkCapacity: number;
  congestion: boolean;
  readBufferSize: number;
  writeBufferSize: number;
  header: {
    type: string;
  };
};

type WebSocketObject = {
  path: string;
  headers: Record<string, string>;
};

type HttpObject = {
  host: string[];
  path: string;
};

type QuicObject = {
  key: string;
  header: {
    type: string;
  };
};

type DomainSocketObject = {
  path: string;
};

type GrpcObject = {
  initial_windows_size: number;
  health_check_timeout: number;
  idle_timeout: number;
  permit_without_stream: boolean;
  user_agent: string;
  serviceName: string;
  multiMode: boolean;
};

type SockoptObject = {
  mark: number;
  tcpFastOpen: boolean;
  tcpFastOpenQueueLength: number;
  tproxy: 'redirect' | 'tproxy' | 'off';
  tcpKeepAliveInterval: number;
};

type TLSObject = Partial<{
  serverName: string;
  alpn: string[];
  allowInsecure: boolean;
  disableSystemRoot: boolean;
  certificates: CertificateObject[];
  verifyClientCertificate: boolean;
  fingerprint: string;
  pinnedPeerCertificateChainSha256: string;
}>;

type CertificateObject = {
  usage: 'encipherment' | 'verify' | 'issue' | 'verifyclient';
  certificateFile: string;
  certificate: string[];
  keyFile: string;
  key: string[];
};

export interface InboundObject {
  listen: string;
  port: number;
  protocol: string;
  settings?: Record<string, any>;
  streamSettings?: StreamSettingsObject;
  tag?: string;
  sniffing?: SniffingObject;
  allocate?: AllocateObject;
}

type V2rayConfigure = {
  inbounds: InboundObject[];
  dns: string;
};

export interface StreamSettingsObject {
  network: 'tcp' | 'kcp' | 'ws' | 'http' | 'domainsocket' | 'quic' | 'grpc';
  security: 'none' | 'tls';
  tlsSettings?: TLSObject;
  tcpSettings?: TcpObject;
  kcpSettings?: KcpObject;
  wsSettings?: WebSocketObject;
  httpSettings?: HttpObject;
  quicSettings?: QuicObject;
  dsSettings?: DomainSocketObject;
  grpcSettings?: GrpcObject;
  sockopt?: SockoptObject;
}

type realitySettings = {
  spiderX: string;
  publicKey: string;
  show: boolean;
  serverName: string;
  shortId: string;
  fingerprint: string;
};

type xtlsSettings = {
  serverName: string;
  allowInsecure: boolean;
  fingerprint: string;
};

type SecurityTypes = 
  | 'none'
  | 'tls'
  | 'reality'
;

export type ConnectionType = 
  | 'tcp'
  | 'kcp'
  | 'ws'
  | 'h2'
  | 'quic'
  | 'grpc'
  | 'multi'
;

export type StreamSettings = {
  network: ConnectionType;
  security: SecurityTypes;
  tlsSettings?: TLSObject;
  tcpSettings?: TcpObject;
  kcpSettings?: KcpObject;
  wsSettings?: WebSocketObject;
  httpSettings?: HttpObject;
  quicSettings?: QuicObject;
  dsSettings?: DomainSocketObject;
  grpcSettings?: GrpcObject;
  realitySettings?: realitySettings;
  xtlsSettings?: xtlsSettings;
  sockopt?: SockoptObject;
  [key: string]: any;
}