const fileStorage = require('../../../dType/contracts/build/contracts/FileTypeStorage.json');
const actionContract = require('../../../dType/contracts/build/contracts/ActionContract.json');
const permContract = require('../../../dType/contracts/build/contracts/PermissionStorage.json');
const voteContract = require('../../../dType/contracts/build/contracts/VoteResourceTypeStorage.json');

const dTypeFS = {
    fsmeta: fileStorage,
    actmeta: actionContract,
    permeta: permContract,
    votecontract: voteContract,
};

export default dTypeFS;
