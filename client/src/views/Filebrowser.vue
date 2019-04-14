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
    created() {
        console.log(this.$store.state);
    },
    methods: {
        onRemove(item) {
            console.log('onRemove', item);
        },
        onAdd(item) {
            console.log('onAdd', item);
            // this.$store.contract.insert(item);
        },
    }
}
</script>
