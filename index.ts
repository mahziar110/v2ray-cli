import { Vless } from './src/helpers/protocols/Vless';

const config = 'vless://76433b5c-1e11-4bd9-9158-c324157ff896@cdn.lionetsub.online:443?security=tls&type=grpc&host=&headerType=&serviceName=Smile&sni=fal.lionetsub.online&fp=chrome&alpn=#%F0%9F%87%A9%F0%9F%87%AA%20Falkenstein';

new Vless(config);
