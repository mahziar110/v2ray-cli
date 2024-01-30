import os from 'node:os';
import { Vless } from './src/services/Vless';
import { File } from './src/helpers/general/File';
import V2rayService from './src/v2ray';
import ProxyService from './src/services/Proxy';

(async () => {
  const file = new File(`${os.homedir()}/v2raycli/config.txt`);
  const config = await file.read();
  console.log(config);

  const vless = new Vless(config);
  const jsonConf = vless.getOutbound();
  new File(`${os.homedir()}/v2raycli/v_config.json`).write(jsonConf);

  const v2ray = new V2rayService(jsonConf as JSON);
  v2ray.start();
  const randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
  const proxy = new ProxyService(
    10871,
    10801,
    randomPort,
    'PAC'
  );
  proxy.start();

  console.log(jsonConf);
})();

