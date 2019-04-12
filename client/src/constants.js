const contractsMetadata = require('../../../dType/contracts/build/contracts/FileTypeStorage.json');
const privateKey = require('../private/privateKey.json');

console.log('contractsMetadata', contractsMetadata);
const dTypeFS = {
    contract: contractsMetadata,
    from: {
        address: '0xCd9492Cdae7E8F8B5a648c6E15c4005C4cd9028b',
        privateKey: privateKey.privateKey,
    },
};

export default dTypeFS;
