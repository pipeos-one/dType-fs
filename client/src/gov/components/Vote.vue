<template>
    <v-card>
        <v-container fluid>
            <v-radio-group v-model="radios" :mandatory="false">
                <v-radio label="yes" :value="true"></v-radio>
                <v-radio label="no" :value="false"></v-radio>
            </v-radio-group>
        </v-container>
        <v-card-actions>
            <v-btn color="green darken-1" flat @click="vote()">Vote!</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        radios: true,
    }),
    methods: {
        vote() {
            this.$emit('vote', this.radios);
        }
    },
};
</script>
