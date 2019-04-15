<template>
    <v-container>
        <v-layout row>
            <v-flex xs5>
                <v-select
                    v-model="storageOption"
                    :items="['swarm', 'ipfs', 'uri']"
                    label="Storage option"
                ></v-select>
            </v-flex>
            <v-flex xs6 offset-xs1>
                <v-text-field v-if='postURL' v-model='postURL' label='gateway url'></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-checkbox
                    v-if='storageOption != "uri"'
                    v-model="isFolder"
                    label="is folder"
                ></v-checkbox>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <MultiFileUploader
                    v-if='storageOption != "uri"'
                    :postURL="postURL"
                    :maxItems="1"
                    successMessagePath=""
                    errorMessagePath=""
                    @loaded="onLoaded"
                    @upload-success='onUploadSuccess'
                    @upload-error="onUploadError"
                />
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs5>
                <v-select
                    v-if='storageOption == "uri"'
                    v-model="extension"
                    :items="extensions"
                    label="file extension"
                ></v-select>
            </v-flex>
            <v-flex xs6 offset-xs1>
                <v-text-field v-if='storageOption == "uri"' v-model='name' label='file name'></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-btn flat icon v-if='storageOption == "uri"' @click="onUpload">
                    <v-icon>fa-upload</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import MultiFileUploader from './MultiFileUploader';
import {STORAGE, EXTENSION_TO_UINT, DEFAULT_POINTER} from '../constants';

export default {
    components: {MultiFileUploader},
    data: () => ({
        postURL: STORAGE['swarm'],
        filePointer: DEFAULT_POINTER,
        storageOption: 'swarm',
        extensions: Object.keys(EXTENSION_TO_UINT),
        name: '',
        extension: Object.keys(EXTENSION_TO_UINT)[1],
        isFolder: false,
    }),
    watch: {
        storageOption() {
            this.postURL = STORAGE[this.storageOption];
        },
    },
    methods: {
        onLoaded(file) {
            let name = file.name.split('.');
            this.filePointer.name = name[0];

            if (this.isFolder) {
                this.filePointer.extension = 0;
            } else {
                this.filePointer.extension = EXTENSION_TO_UINT[name[1]];
            }
        },
        onUploadSuccess(result) {
            this.filePointer[this.storageOption].protocol = 1;
            this.filePointer[this.storageOption].filehash = '0x' + result.data;
            this.$emit('upload-success', this.filePointer);
            this.filePointer = DEFAULT_POINTER;
        },
        onUploadError(result) {
            console.log('onUploadError', result);
        },
        onUpload() {
            this.filePointer.name = this.name;
            this.filePointer.extension = EXTENSION_TO_UINT[this.extension];
            this.filePointer[this.storageOption].uri = this.postURL;
            this.$emit('upload-success', this.filePointer);
            this.filePointer = DEFAULT_POINTER;
        },
    },
}
</script>
