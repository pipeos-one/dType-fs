<template>
    <div>
        <v-treeview
            ref="fileTree"
            v-model="tree"
            :open="open"
            :items="items"
            activatable
            open-all
            item-key="id"
            item-text="name"
            active-class="grey lighten-4 indigo--text"
        >
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.file == 0">
                    {{ open ? 'fa-folder-open' : 'fa-folder' }}
                </v-icon>
                <v-icon v-else>
                    {{ files[item.file] || files.default }}
                </v-icon>
            </template>
            <template v-slot:append="{ item, active }">
                <template v-if="active || onAction === item.id">
                    <v-btn flat icon @click="onRemove(item)">
                        <v-icon>fa-trash</v-icon>
                    </v-btn>
                    <v-btn flat icon v-if="item.file == 0" @click="onAdd(item)">
                        <v-icon>fa-plus</v-icon>
                    </v-btn>

                    <v-btn flat icon @click="onOpen(item)">
                        <v-icon>fa-external-link-alt</v-icon>
                    </v-btn>
                </template>

                <!-- <v-btn flat icon v-if="active">
                    <v-icon>fa-chevron-up</v-icon>
                </v-btn>
                <v-btn flat icon v-if="active">
                    <v-icon>fa-chevron-down</v-icon>
                </v-btn> -->
            </template>
        </v-treeview>
        <v-dialog v-model="dialogAdd" width="500">
            <v-card>
                <FileUpload
                    @upload-success="onFile"
                />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {filePointerToUrl} from '../utils';
import FileUpload from './FileUpload';

export default {
    props: ['items'],
    components: {
        FileUpload,
    },
    data: () => ({
        dialogAdd: false,
        onAction: false,
        open: ['public'],
        files: {
            0: 'fa-folder',
            1: 'fa-file-alt',
            2: 'fa-file-alt',
            default: 'fa-star',
            html: 'fa-html5',
            js: 'fa-node-js',
            json: 'fa-json',
            md: 'fa-markdown',
            pdf: 'fa-file-pdf',
            png: 'fa-image',
            txt: 'fa-file-alt',
        },
        tree: [],
        parent: null,
    }),
    watch: {
        items() {
            this.$refs.fileTree.updateAll(true);
            setTimeout(() => {
                this.$refs.fileTree.updateAll(true);
            }, 2000);
        },
    },
    methods: {
        onRemove(item) {
            this.$emit('remove', item);
        },
        onAdd(item) {
            this.onAction = item.id;
            this.dialogAdd = true;
            this.parent = item;
        },
        onOpen(item) {
            let uri = filePointerToUrl(item.fileType.pointer);
            window.open(uri, '_blank');
        },
        onFile(pointer) {
            this.dialogAdd = false;
            this.$emit('add', {
                pointer,
                parentKey: this.parent.fileType.dataHash,
                filesPerFolder: [],
            });
        },
    }
}
</script>
