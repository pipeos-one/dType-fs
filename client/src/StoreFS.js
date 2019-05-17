import {ethers} from 'ethers';
import Vue from 'vue';
import Vuex from 'vuex';
import dTypeFS from './namespace';
import {
    getProvider,
    getContract,
    normalizeEthersObject,
    encodedParams,
    calcPermission,
    getBasePermissions,
    getPermissions,
} from './blockchain';
import {
    changeTreeItem,
    removeTreeItem,
    fileToTree,
} from './utils.js';

Vue.use(Vuex);

const StoreFS = new Vuex.Store({
    state: {
        provider: null,
        wallet: null,
        fscontract: null,
        acontract: null,
        percontract: null,
        votecontract: null,
        fsTree: [],
        added: {},
        dTypeFS,
        basePermissions: {},
    },
    mutations: {
        setProvider(state, provider) {
            state.provider = provider;
        },
        setWallet(state, wallet) {
            state.wallet = wallet;
        },
        setContract(state, {contract, type}) {
            state[type] = contract;
        },
        setBasePermissions(state, permissions) {
            state.basePermissions = permissions;
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
        updateFile(state, obj) {
            const {oldfile, file} = obj;
            if (!state.added[oldfile.dataHash]) return;
            if (oldfile.dataHash !== file.dataHash) return;

            const indexKid = state.added[oldfile.dataHash][state.added[oldfile.dataHash].length - 1];
            file.index = oldfile.index;

            // delete first
            state.fsTree = removeTreeItem(state.fsTree, oldfile.dataHash, state.added[oldfile.dataHash]);

            // Add it with same index

            // Can happen if the inreview file was accepted
            if (!state.added[file.parentKey]) {
                delete state.added[oldfile.dataHash];
                return;
            }
            state.fsTree = changeTreeItem(
                state.fsTree,
                file,
                state.added[file.parentKey],
                (parent) => {},
                indexKid,
            );
            state.added[file.dataHash] = state.added[file.parentKey].concat([indexKid]);
        },
        removeFile(state, dataHash) {
            if (!state.added[dataHash]) return;
            state.fsTree = removeTreeItem(state.fsTree, dataHash, state.added[dataHash]);
            delete state.added[dataHash];
        },
    },
    actions: {
        setProvider({commit, state}) {
            return getProvider().then(({provider, wallet}) => {
                commit('setProvider', provider);
                commit('setWallet', wallet);
            });
        },
        async setContracts({commit, state}) {
            const fsAddress = state.dTypeFS.fsmeta.networks[
                String(state.provider.network.chainId)
            ].address;
            const fscontract = await getContract(
                fsAddress,
                state.dTypeFS.fsmeta.abi,
                state.wallet,
            );
            commit('setContract', {contract: fscontract, type: 'fscontract'});

            const actAddress = state.dTypeFS.actmeta.networks[
                String(state.provider.network.chainId)
            ].address;
            const acontract = await getContract(
                actAddress,
                state.dTypeFS.actmeta.abi,
                state.wallet,
            );
            commit('setContract', {contract: acontract, type: 'acontract'});

            const perAddress = state.dTypeFS.permeta.networks[
                String(state.provider.network.chainId)
            ].address;
            const percontract = await getContract(
                perAddress,
                state.dTypeFS.permeta.abi,
                state.wallet,
            );
            commit('setContract', {contract: percontract, type: 'percontract'});
            const voteAddress = state.dTypeFS.votecontract.networks[
                String(state.provider.network.chainId)
            ].address;
            const votecontract = await getContract(
                voteAddress,
                state.dTypeFS.votecontract.abi,
                state.wallet,
            );
            commit('setContract', {contract: votecontract, type: 'votecontract'});
        },
        async getFile({state}, hash) {
            let struct = await state.fscontract.getByHash(hash);
            struct.dataHash = hash;
            struct.permissions = await getPermissions(
                state.wallet._address,
                state.basePermissions,
                state.fscontract,
                state.percontract,
                struct.dataHash,
            );

            return normalizeEthersObject(struct);
        },
        async getFolderRecursive({dispatch, commit}, hash) {
            const file = await dispatch('getFile', hash);
            commit('addFile', file);
            file.filesPerFolder.forEach(async (dataHash) => {
                await dispatch('getFolderRecursive', dataHash)
            });
        },
        async getFileReview({state, commit}, {hash, proponent}) {
            const struct = await state.fscontract.inreview(hash, proponent);
            struct.dataHash = hash;
            struct.inreview = true;
            struct.permissions = {
                insert: {allowed: false},
                update: {allowed: false},
                remove: {allowed: false},
            };
            const voteHash = await state.votecontract.getHash({
                contractAddress: state.fscontract.address,
                dataHash: hash,
                proponent: proponent,
            });
            struct.vote = await state.votecontract.getByHash(voteHash);
            struct.vote.votingResourceHash = voteHash;
            return normalizeEthersObject(struct);
        },
        async setFsData({dispatch, commit, state}, rootHash) {
            if (rootHash) {
                await dispatch('getFolderRecursive', rootHash);
                return;
            }
            const count = await state.fscontract.count();
            for (let i = 0; i < count; i++) {
                const hash = await state.fscontract.typeIndex(i);
                await dispatch('getFolderRecursive', hash);
            }
            dispatch('getPastEvents', 'LogNewReview');
        },
        async setBasePermissions({commit, state}) {
            const permissions = await getBasePermissions(state.fscontract, state.percontract);
            commit('setBasePermissions', permissions);
        },
        insertFile({state}, file) {
            console.log('insert file', JSON.stringify(file));

            const encoded = encodedParams(state.fscontract, 'insert', [file]);

            return state.acontract.run(
                state.fscontract.address,
                state.fscontract.interface.functions.insert.sighash,
                encoded,
            ).then(tx => tx.wait(2)).then(console.log);
        },
        removeFile({state}, dataHash) {
            console.log('remove file', dataHash);
            const encoded = encodedParams(state.fscontract, 'remove', [dataHash]);
            return state.acontract.run(
                state.fscontract.address,
                state.fscontract.interface.functions.remove.sighash,
                encoded,
            ).then(tx => tx.wait(2)).then(console.log);
        },
        async vote({state, commit, dispatch}, obj) {
            const data = ethers.utils.defaultAbiCoder.encode(
                ['bool', 'uint256', 'address'],
                [obj.value, 0, state.wallet._address],
            );

            await state.acontract.vote(obj.item.vote.votingResourceHash, data);
            const file = await dispatch('getFileReview', {hash: obj.item.dataHash, proponent: obj.item.vote.proponent});
            commit('updateFile', {oldfile: obj.item, file});
        },
        getPastEvents({state, dispatch, commit}, eventName) {
            const topic = state.fscontract.interface.events[eventName].topic;
            const filter = {
                address: state.fscontract.address,
                fromBlock: 0,
                toBlock: 'latest',
                topics: [ topic ],
            };

            state.provider.getLogs(filter).then((pastLogs) => {
                pastLogs.forEach((log) => {
                    const event = state.fscontract.interface.parseLog(log);
                    dispatch('getFileReview', {hash: event.values.hash, proponent: event.values.proponent}).then((file) => {
                        commit('addFile', file);
                    });
                });
            });
        },
        watchAll({dispatch}) {
            return dispatch('watchInsert').then(() => {
                dispatch('watchUpdate');
            }).then(() => {
                dispatch('watchRemove');
            }).then(() => {
                dispatch('watchInsertReview');
            });
        },
        removeWatchers({state}) {
            return state.fscontract.removeAllListeners('LogNew')
                .removeAllListeners('LogUpdate')
                .removeAllListeners('LogRemove')
                .removeAllListeners('LogInsertReview');
        },
        watchInsert({dispatch, state}) {
            state.fscontract.on('LogNew', (dataHash, index) => {
                console.log('LogNew', dataHash, index);
                dispatch('getFolderRecursive', dataHash);
            });
        },
        watchUpdate({state}) {
            state.fscontract.on('LogUpdate', (dataHash, index) => {
                console.log('LogUpdate', dataHash, index, index.toNumber());
                // TODO
            });
        },
        watchRemove({commit, state}) {
            state.fscontract.on('LogRemove', (dataHash) => {
                console.log('LogRemove', dataHash);
                commit('removeFile', dataHash);
            });
        },
        watchInsertReview({dispatch, commit, state}) {
            state.fscontract.on('LogNewReview', (hash, proponent) => {
                console.log(`LogNewReview: ${hash}, ${proponent}`);
                dispatch('getFileReview', {hash, proponent}).then((file) => {
                    commit('addFile', file);
                });
            });
        },
    },
});

export default StoreFS;
