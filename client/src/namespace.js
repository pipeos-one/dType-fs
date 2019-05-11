const fileStorage = require('../../../dType/contracts/build/contracts/FileTypeStorage.json');
const actionContract = require('../../../dType/contracts/build/contracts/ActionContract.json');
const permContract = require('../../../dType/contracts/build/contracts/PermissionStorage.json');
const privateKey = require('../private/privateKey.json');

const dTypeFS = {
    fsmeta: fileStorage,
    actmeta: actionContract,
    permeta: permContract,
    from: {
        address: '0xCd9492Cdae7E8F8B5a648c6E15c4005C4cd9028b',
        privateKey: privateKey.privateKey,
    },
};

export default dTypeFS;
