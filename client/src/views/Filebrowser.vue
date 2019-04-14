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
            console.log('onRemove', item);
        },
        onAdd(file) {
            this.$store.state.contract.insert(file);
        },
    }
}
</script>
