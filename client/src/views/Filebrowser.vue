<template>
    <v-container fluid>
        <v-btn fixed right top flat icon @click="showDescr = !showDescr">
            <v-icon v-if="showDescr">fa-eye-slash</v-icon>
            <v-icon v-else>fa-eye</v-icon>
        </v-btn>
        <div v-if="showDescr" v-html="description1"></div>
        <BrowserTree
            :items='fsTree'
            v-on:remove="onRemove"
            v-on:add="onAdd"
            v-on:vote="onVote"
        />
        <div v-if="showDescr" v-html="description2"></div>
    </v-container>
</template>

<script>
import axios from 'axios';
import marked from 'marked';
import BrowserTree from '../components/BrowserTree';
import {getTreeBranch, filePointerToUrl} from '../utils';

export default {
    components: {BrowserTree},
    props: ['rootHash'],
    data: () => ({
        description1: '',
        description2: '',
        showDescr: false,
    }),
    mounted() {
        this.setData();
    },
    destroyed() {
        this.$store.dispatch('removeWatchers');
    },
    watch: {
        rootHash() {
            this.setData();
        },
    },
    computed: {
        fsTree() {
            return this.$store.state.fsTree;
        },
    },
    methods: {
        async setData() {
            await this.$store.dispatch('setProvider');
            await this.$store.dispatch('setContracts');
            await this.$store.dispatch('setBasePermissions');
            await this.$store.dispatch('setFsData', this.rootHash);
            this.$store.dispatch('watchAll');
            this.setRootDescription();
        },
        async setRootDescription() {
            const url = filePointerToUrl(this.$store.state.fsTree[0].fileType.pointer);
            let content = (await axios.get(url)).data;
            if (!content) return;
            if (typeof content !== 'string') return;
            content = content.split('<content>');
            this.description1 = marked(content[0], { sanitize: true });
            this.description2 = marked(content[1], { sanitize: true });
        },
        onRemove(item) {
            this.$store.dispatch('removeFile', item.fileType.dataHash);
        },
        onAdd(file) {
            this.$store.dispatch('insertFile', file);
        },
        onVote(item) {
            this.$store.dispatch('vote', item);
        }
    }
}
</script>
