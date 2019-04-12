<template>
    <v-treeview
        v-model="tree"
        :open="open"
        :items="items"
        activatable
        item-key="name"
        open-on-click
    >
        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
                {{ open ? 'folder-open' : 'folder' }}
            </v-icon>
            <v-icon v-else>
                {{ files[item.file] }}
            </v-icon>
        </template>
    </v-treeview>
</template>

<script>

export default {
    props: ['items'],
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
}
</script>
