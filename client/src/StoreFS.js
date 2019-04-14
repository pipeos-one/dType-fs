import Vue from 'vue';
import Vuex from 'vuex';
import dTypeFS from './namespace';
import {getProvider, getContract,  normalizeEthersObject} from './blockchain';
import {changeTreeItem, fileToTree} from './utils.js';

Vue.use(Vuex);

const StoreFS = new Vuex.Store({
    state: {
        provider: null,
        wallet: null,
        contract: null,
        fsTree: [],
        added: {},
        dTypeFS,
    },
    mutations: {
        setProvider(state, provider) {
            state.provider = provider;
        },
        setWallet(state, wallet) {
            state.wallet = wallet;
        },
        setContract(state, contract) {
            state.contract = contract;
        },
        addFile(state, file) {
            let indexKid;
            if (state.added[file.dataHash]) return;

            file.index = Object.keys(state.added).length;
            if (!state.added[file.parentKey]) {
                state.fsTree.push(fileToTree(file));
                state.added[file.dataHash] = [state.fsTree.length - 1];
                return;
            }
            state.fsTree = changeTreeItem(state.fsTree, file, state.added[file.parentKey], (parent) => {
                indexKid = parent.children.length - 1;
            });
            state.added[file.dataHash] = state.added[file.parentKey].concat([indexKid]);
        },
    },
    actions: {
        setProvider({commit, state}) {
            return getProvider(state.dTypeFS.from.privateKey).then(({provider, wallet}) => {
                commit('setProvider', provider);
                commit('setWallet', wallet);
            });
        },
        setContract({commit, state}) {
            const contractAddress = state.dTypeFS.contract.networks[
                String(state.provider.network.chainId)
            ].address;
            return getContract(
                contractAddress,
                state.dTypeFS.contract.abi,
                state.wallet,
            ).then((contract) => {
                commit('setContract', contract);
            });
        },
        async getFile({state, commit}, hash) {
            let struct = await state.contract.getByHash(hash);
            struct.dataHash = hash;
            return normalizeEthersObject(struct);
        },
        async getFolderRecursive({dispatch, commit}, hash) {
            const file = await dispatch('getFile', hash);
            commit('addFile', file);

            file.filesPerFolder.forEach(async (dataHash) => {
                await dispatch('getFolderRecursive', dataHash)
            });
        },
        async setFsData({dispatch, commit, state}) {
            const count = await state.contract.count();
            for (let i = 0; i < count; i++) {
                const hash = await state.contract.typeIndex(i);
                await dispatch('getFolderRecursive', hash);
            }
        },
    },
});

export default StoreFS;
