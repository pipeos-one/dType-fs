export const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const SWARM_PROTOCOL = {
    0: 'bzz',
    1: 'bzz-raw',
};
export const SWARM_GATEWAY = 'https://swarm-gateways.net';

export const IPFS_GATEWAY = 'https://gateway.ipfs.io';
export const IPFS_PROTOCOL = {0: 'ipfs'};

export const STORAGE = {
    swarm: `${SWARM_GATEWAY}/${SWARM_PROTOCOL[1]}:/`,
    ipfs: `${IPFS_GATEWAY}/${IPFS_PROTOCOL[0]}`,
    uri: 'http://localhost:8000',
};

export const EXTENSION_TO_UINT = {
    dir: 0,
    md: 1,
    txt: 2,
    sol: 3,
};

export const UINT_TO_EXTENSION = Object.keys(EXTENSION_TO_UINT);

export const DEFAULT_POINTER = {
    name: '',
    extension: 0,
    swarm: {protocol: 0, filehash: EMPTY_BYTES32},
    ipfs: {protocol: 0, filehash: EMPTY_BYTES32},
    uri: {uri: ''},
};
