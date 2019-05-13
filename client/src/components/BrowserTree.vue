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
                <div class="iconW">
                    <v-icon v-if="item.file == 0" :color="getPermissionColor(item.fileType)">
                        {{ open ? 'fa-folder-open' : 'fa-folder' }}
                    </v-icon>

                    <v-icon v-else :color="getPermissionColor(item.fileType)">
                        {{ getIcon(item.file) }}
                    </v-icon>
                </div>
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
        <v-dialog v-model="dialogAdd" width="600">
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
import {EXTENSION_TO_ICON, UINT_TO_EXTENSION} from '../constants';
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
        dialogAdd() {
            this.onAction = false;
        }
    },
    methods: {
        getIcon(extension) {
            return EXTENSION_TO_ICON[UINT_TO_EXTENSION[extension]] || EXTENSION_TO_ICON.default;
        },
        onRemove(item) {
            this.$emit('remove', item);
        },
        onAdd(item) {
            this.onAction = item.id;
            this.dialogAdd = true;
            this.parent = item;
        },
        onOpen(item) {
            let uri;
            if (item.fileType.pointer.extension == 0) {
                uri = `/#/${item.fileType.dataHash}`;
            } else  {
                uri = filePointerToUrl(item.fileType.pointer);
            }
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
        getPermissionColor(item) {
            if (
                !item.permissions.insert.allowed &&
                !item.permissions.update.allowed &&
                !item.permissions.remove.allowed
            ) {
                return '#cccccc';
            }
            return '#737373';
        }
    }
}
</script>

<style>
.iconW {
    width: 30px;
    padding-left: 4px;
}
.v-treeview-node__label {
    max-width: 150px;
}
</style>
