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
                    <v-icon v-if="item.file == 0" :color="getPermissionColor(dpermission(item.fileType))">
                        {{ open ? 'fa-folder-open' : 'fa-folder' }}
                    </v-icon>

                    <v-icon v-else :color="getPermissionColor(dpermission(item.fileType))">
                        {{ getIcon(item.file) }}
                    </v-icon>
                </div>
            </template>
            <template v-slot:append="{ item, active }">
                <template v-if="active || onAction === item.id">
                    <v-btn
                        flat icon
                        @click="onRemove(item)"
                        :color="getPermissionColor(rpermission(item.fileType))"
                    >
                        <v-icon>fa-trash</v-icon>
                    </v-btn>

                    <v-btn
                        v-if="item.file == 0"
                        flat icon
                        @click="onAdd(item)"
                        :color="getPermissionColor(ipermission(item.fileType))"
                    >
                        <v-icon>fa-plus</v-icon>
                    </v-btn>

                    <v-btn flat icon @click="onOpen(item)">
                        <v-icon>fa-external-link-alt</v-icon>
                    </v-btn>

                    <v-btn
                        v-if="dpermission(item.fileType) === 3"
                        flat icon
                        @click="onVote(item)"
                        color="#A6BF88"
                    >
                        <v-icon>fa-poll</v-icon>
                    </v-btn>
                    <v-dialog v-model="dialogVote" v-if="item.fileType.vote" width="600">
                        <Vote
                            :votingResource="item.fileType.vote"
                            :name="item.name"
                            v-on:vote="voteAction"
                        />
                    </v-dialog>
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
import {Vote} from '../gov';
import {filePointerToUrl} from '../utils';
import {EXTENSION_TO_ICON, UINT_TO_EXTENSION} from '../constants';
import FileUpload from './FileUpload';

export default {
    props: ['items'],
    components: {
        FileUpload,
        Vote
    },
    data: () => ({
        dialogAdd: false,
        dialogVote: false,
        onAction: false,
        open: ['public'],
        tree: [],
        parent: null,
        inVote: null,
        intervalStep:0,
        intervalId: null,
    }),
    destroyed() {
        this.clearTreeInterval();
    },
    watch: {
        items() {
            this.$refs.fileTree.updateAll(true);
            this.intervalId = setInterval(() => {
                this.$refs.fileTree.updateAll(true);
                this.intervalStep ++;
                if (this.intervalStep > 4) {
                    this.clearTreeInterval();
                }
            }, 2000);
        },
        dialogAdd() {
            this.onAction = false;
        },
        dialogVote() {
            if (this.dialogVote === false) {
                this.onAction = false;
            }
        }
    },
    methods: {
        clearTreeInterval() {
            if (!this.intervalId) return;
            clearInterval(this.intervalId);
            this.intervalStep = 0;
            this.intervalId = null;
        },
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
                thesaurus: {
                    name: pointer.name,
                    parentKey: this.parent.fileType.dataHash,
                    kids: [],
                }
            });
        },
        onVote(item) {
            this.inVote = item;
            this.dialogVote = !this.dialogVote;
            this.onAction = item.id;
        },
        voteAction(value) {
            this.$emit('vote', {
                value,
                item: this.inVote.fileType,
            });
        },
        dpermission(item) {
            if (item.inreview === true) {
                return 3;
            }
            return (
                item.permissions.insert.allowed
                || item.permissions.update.allowed
                || item.permissions.remove.allowed
            );
        },
        ipermission(item) {
            return item.permissions.insert.allowed;
        },
        rpermission(item) {
            return item.permissions.remove.allowed;
        },
        getPermissionColor(status) {
            return status === 3 ? '#A0C181' : (status ? '#424242' : '#757575');
        },
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
