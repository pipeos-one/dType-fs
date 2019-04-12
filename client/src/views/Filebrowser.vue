<template>
    <BrowserTree :items='fsTree'/>
</template>

<script>
import BrowserTree from '../components/BrowserTree';

export default {
    components: {BrowserTree},
    data: () => ({
        open: ['public'],
        files: {
            html: 'html5',
            js: 'node-js',
            json: 'json',
            md: 'markdown',
            pdf: 'file-pdf',
            png: 'image',
            txt: 'file-alt',
        },
        tree: [],
    }),
    computed: {
        fsTree() {
            return this.$store.state.fsTree;
        },
    },
    created() {
        console.log(this.$store.state);
    },
}
</script>
