<template>
    <v-app>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    created() {
        this.setData();
    },
    destroyed() {
        // this.$store.dispatch('removeWatchers');
    },
    methods: {
        async setData() {
            // await this.$store.dispatch('setProvider');
            // await this.$store.dispatch('setContract');
            // this.$store.dispatch('watchAll');
        },
    },
}
</script>
