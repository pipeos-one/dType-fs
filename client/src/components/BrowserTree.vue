<template>
    <div>
        <v-treeview
            v-model="tree"
            :open="open"
            :items="items"
            activatable
            item-key="id"
            item-text="name"
            active-class="grey lighten-4 indigo--text"
        >
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.file == 0">
                    {{ open ? 'fa-folder-open' : 'fa-folder' }}
                </v-icon>
                <v-icon v-else>
                    {{ files[item.file] }}
                </v-icon>
            </template>
        </v-treeview>
        <v-dialog v-model="dialogAdd" width="500">
            <v-card>
                <FileUpload
                    :fileChangedCallback="onFile"
                />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

export default {
    props: ['items'],
    data: () => ({
        open: ['public'],
        files: {
            0: 'fa-folder',
            1: 'fa-file-alt',
            2: 'fa-file-alt',
            html: 'fa-html5',
            js: 'fa-node-js',
            json: 'fa-json',
            md: 'fa-markdown',
            pdf: 'fa-file-pdf',
            png: 'fa-image',
            txt: 'fa-file-alt',
        },
        tree: [],
    }),
}
</script>
