import os from 'node:os';

export const pacDir = `${os.homedir}/v2raycli/pac`;
export const globalPacConf = `${pacDir}/gfwlist.txt`;
export const userPacConf = `${pacDir}/gfwlist-user.txt`;
