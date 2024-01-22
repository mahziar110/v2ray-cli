"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vless = void 0;
class Vless {
    constructor(config_uri) {
        console.log(this.parseVless(config_uri));
    }
    parseVless(uri) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const [address, port] = uri.includes('?')
            ? uri.slice(8).split('?')[0].split(':')
            : uri.slice(8).split('#')[0].split(':');
        const url = new URLSearchParams(uri.slice(8).split('?')[1].split('#')[0]);
        const config = {
            id: address.split('@')[0],
            address: address.split('@')[1],
            port: parseInt(port),
            remark: uri.split('#')[1],
            encryption: (_a = url.get('encryption')) !== null && _a !== void 0 ? _a : '',
            security: (_b = url.get('security')) !== null && _b !== void 0 ? _b : '',
            sni: (_c = url.get('sni')) !== null && _c !== void 0 ? _c : '',
            type: ((_d = url.get('type')) !== null && _d !== void 0 ? _d : 'tcp'),
            host: (_e = url.get('host')) !== null && _e !== void 0 ? _e : '',
            path: (_f = url.get('path')) !== null && _f !== void 0 ? _f : '',
            flow: (_g = url.get('flow')) !== null && _g !== void 0 ? _g : '',
            seed: (_h = url.get('seed')) !== null && _h !== void 0 ? _h : '',
            pbk: (_j = url.get('pbk')) !== null && _j !== void 0 ? _j : '',
            sid: (_k = url.get('sid')) !== null && _k !== void 0 ? _k : '',
            fp: (_l = url.get('fp')) !== null && _l !== void 0 ? _l : '',
            headerType: (_m = url.get('headerType')) !== null && _m !== void 0 ? _m : ''
        };
        return config;
    }
}
exports.Vless = Vless;
