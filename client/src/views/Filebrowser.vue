<template>
    <BrowserTree
        :items='fsTree'
        v-on:remove="onRemove"
        v-on:add="onAdd"
    />
</template>

<script>
import BrowserTree from '../components/BrowserTree';

export default {
    components: {BrowserTree},
    data: () => ({}),
    computed: {
        fsTree() {
            return this.$store.state.fsTree;
        },
    },
    methods: {
        onRemove(item) {
            this.$store.dispatch('removeFile', item.fileType.dataHash);
        },
        onAdd(file) {
            this.$store.dispatch('insertFile', file);
        },
    }
}
</script>
