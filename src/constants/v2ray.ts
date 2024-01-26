export const inbounds: any = [
  {
    listen: '127.0.0.1',
    port: 10801,
    protocol: 'socks',
    tag: 'socks-inbound',
    allocate: {
      strategy: 'always',
      refresh: 5,
      concurrency: 3,
    },
  },
  {
    listen: '127.0.0.1',
    port: 10871,
    protocol: 'http',
    tag: 'http-inbound',
    allocate: {
      strategy: 'always',
      refresh: 5,
      concurrency: 3,
    },
  },

  {
  listen: '127.0.0.1',
  port: 10085,
  protocol: 'dokodemo-door',
  settings: {
      address: '127.0.0.1',
    },
    tag: 'api',
  },
];

