# dType-fs

Client app for a decentralized filesystem.
Vision: https://medium.com/@loredana.cirstea/a-vision-of-a-global-operating-system-filesystem-c7019558b8c7

This is a work in progress, proof a concept.

The smart contracts used for building the filesystem can be found at our [dType repo](https://github.com/pipeos-one/dType/tree/master/contracts/contracts/examples/filesystem).



## Run client app

You will need to deploy the smart contracts first on a private chain. Follow the instructions found at https://github.com/pipeos-one/dType#development.

Then, replace the path to the build file `build/contracts/FileTypeStorage.json`, if needed:  https://github.com/pipeos-one/dType-fs/blob/master/client/src/namespace.js#L1

(The setup will become simpler as the project progresses).

```
git clone https://github.com/pipeos-one/dType-fs.git
cd dType-fs
npm install
npm run serve
```

