<template>
    <v-card>
        <v-container fluid>
            <h3 class="headline mb-0">{{name}}</h3>
            <p>Votes yes: {{votingResource.scoreyes}}</p>
            <p>Votes no: {{votingResource.scoreno}}</p>
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
    props: ['votingResource', 'name'],
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
