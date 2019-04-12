export const changeTreeItem = (tree, file, path, callback) => {
    let item = tree;
    path.forEach((index) => {
        if (item.children) {
            item = item.children;
        }
        item = item[index];
    });

    item.children.push(fileToTree(file));
    callback(item);
    return tree;
};

export const fileToTree = (file) => {
    return {
        id: file.index,
        name: file.pointer.name,
        file: file.pointer.extension,
        children: file.children || [],
        fileType: file,
    };
};
