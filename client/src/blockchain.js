import {ethers} from 'ethers';

export const waitAsync = async function(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
};

export const getProvider = async function(privateKey) {
    // Metamask
    let provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    let wallet = new ethers.Wallet(privateKey, provider);

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
