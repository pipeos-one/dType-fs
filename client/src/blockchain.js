import {ethers} from 'ethers';

export const waitAsync = async function(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
};

export const getProvider = async function() {
    // Metamask
    let provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    let wallet = provider.getSigner();

    await waitAsync(1000);

    // Temporary fix for Ganache
    if (provider.network.chainId === 5777) {
        const url = 'http://192.168.1.140:8545';
        provider = new ethers.providers.JsonRpcProvider(url);
        wallet = provider.getSigner(0);
        await waitAsync(1000);
    }

    return {provider, wallet};
};

export const getContract = async function(address, abi, wallet) {
    const contract = new ethers.Contract(address, abi, wallet);
    // await waitAsync(1000);
    return contract;
};

export const isEthersObj = (item) => {
    if (
        item instanceof Array
        && Object.keys(item).find(key => !Number(key) && Number(key) !== 0)
    ) {
        return true;
    }
    return false;
};

export const normalizeEthersObject = (item) => {
    if (!(item instanceof Object)) return item;
    if (item instanceof Object && item.toNumber) return item.toNumber();
    if (item instanceof Array && !isEthersObj(item)) {
        return item.map(value => normalizeEthersObject(value));
    }
    let obj = {};

    Object.keys(item)
        .filter(key => !Number(key) && Number(key) !== 0)
        .forEach((key) => {
            obj[key] = normalizeEthersObject(item[key]);
        });
    return obj;
};

export const encodedParams = (contract, functionName, params) => {
    return ethers.utils.defaultAbiCoder.encode(
        contract.interface.functions[functionName].inputs,
        params,
    );
};

export const getBasePermissions = async(fscontract, percontract) => {
    const permissions = {};
    const funcNames = ['insert', 'update', 'remove'];

    for (const funcName of funcNames) {
        permissions[funcName] = await percontract.get({
            contractAddress: fscontract.address,
            functionSig: fscontract.interface.functions[funcName].sighash,
            transitionHash: ethers.constants.HashZero,
            dataHash: ethers.constants.HashZero,
        });
    }
    return permissions;
};

export const calcPermission = (address, permission) => {
    return permission.anyone || permission.allowed === address;
};

export const getPermissions = async(address, basePermissions, fscontract, percontract, dataHash) => {
    let permissions = {};

    for (const funcName of Object.keys(basePermissions)) {
        permissions[funcName] = {};

        permissions[funcName].allowed = calcPermission(address, basePermissions[funcName]);

        if (!permissions[funcName].allowed) {
            // Get record permissions
            let perm = await percontract.get({
                contractAddress: fscontract.address,
                functionSig: fscontract.interface.functions[funcName].sighash,
                transitionHash: ethers.constants.HashZero,
                dataHash,
            });
            permissions[funcName].allowed = calcPermission(address, perm);

            // Get specific transition permissions
            permissions[funcName].transitions = {};
            if (basePermissions[funcName].permissionProcess) {
                const transitions = basePermissions[funcName].permissionProcess.allowedTransitions;

                for (const transitionHash of transitions) {
                    let perm = await percontract.get({
                        contractAddress: fscontract.address,
                        functionSig: fscontract.interface.functions[funcName].sighash,
                        transitionHash,
                        dataHash,
                    });
                    permissions[funcName].transitions[transitionHash] = calcPermission(address, perm);
                }
            }
        }
    }
    return permissions;
};
