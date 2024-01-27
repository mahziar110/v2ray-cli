import os from 'node:os';
import { Vless } from './src/services/Vless';
import { File } from './src/helpers/general/File';
import V2rayService from './src/v2ray';

(async () => {
  const file = new File(`${os.homedir()}/v2raycli/config.txt`);
  const config = await file.read();
  console.log(config);

  const vless = new Vless(config);
  const outbounds = vless.getOutbound();
  new File(`${os.homedir()}/v2raycli/v_config.json`).write(outbounds);

  const v2ray = new V2rayService(outbounds as JSON);
  v2ray.start();

  console.log(outbounds);
})();

