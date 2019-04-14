import {
    EMPTY_BYTES32,
    SWARM_PROTOCOL,
    SWARM_GATEWAY,
    IPFS_PROTOCOL,
    IPFS_GATEWAY,
} from './constants';

export const changeTreeItem = (tree, file, path, callback) => {
    let item = tree;
    path.forEach((index) => {
        if (item.children) {
            item = item.children;
        }
        item = item[index];
    });

    item.children.push(fileToTree(file));
    callback(item);
    return tree;
};

export const fileToTree = (file) => {
    return {
        id: file.index,
        name: file.pointer.name,
        file: file.pointer.extension,
        children: file.children || [],
        fileType: file,
    };
};

export const swarmPointerToUrl = (pointer) => {
    if (pointer.filehash === EMPTY_BYTES32) {
        return null;
    }
    return `${SWARM_GATEWAY}/${SWARM_PROTOCOL[pointer.protocol]}:/${pointer.filehash.substring(2)}`;
};

export const ipfsPointerToUrl = (pointer) => {
    if (pointer.filehash === EMPTY_BYTES32) {
        return null;
    }
    return `${IPFS_GATEWAY}/${IPFS_PROTOCOL[pointer.protocol]}/${pointer.filehash.substring(2)}`;
};

export const uriPointerToUrl = (pointer) => {
    return pointer.uri;
};

export const filePointerToUrl = (pointer) => {
    return (
        swarmPointerToUrl(pointer.swarm)
        || ipfsPointerToUrl(pointer.ipfs)
        || uriPointerToUrl(pointer.uri)
    );
};