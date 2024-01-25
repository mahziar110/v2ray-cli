import os from 'node:os';
import { Vless } from './src/helpers/protocols/Vless';
import { File } from './src/helpers/general/File';
import V2rayService from './src/v2ray';

const config = 'vless://76433b5c-1e11-4bd9-9158-c324157ff896@cdn.lionetsub.online:443?security=tls&type=grpc&host=&headerType=&serviceName=Smile&sni=fal.lionetsub.online&fp=chrome&alpn=#%F0%9F%87%A9%F0%9F%87%AA%20Falkenstein';

const vless = new Vless(config);
const outbounds = vless.getOutbound();
new File(`${os.homedir()}/v2ray-cli/v_config.json`).write(outbounds);

const v2ray = new V2rayService(outbounds as JSON);
v2ray.start();

console.log(outbounds);
