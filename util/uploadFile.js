const fs = require('fs');
const bson = require('bson');
const BSON = new bson.BSON();

const UploadFile = require('../models/uploadFile');
const UploadChunk = require('../models/uploadChunk');

const chunkSize = 500; // in kB

module.exports = async function uploadFile(file, fileName, fileType, metaData, username, public) {
    const B64str = Buffer.from(file).toString('base64');

    const docSize = BSON.calculateObjectSize(new UploadFile({ fileName: B64str })) / 1024;
    const chunksAmount = Math.ceil(docSize / chunkSize);
    const chunkLength = B64str.length / chunksAmount;

    var chunkIDs = [];

    // create uploadchunks
    for(i=0; i<chunksAmount; i++) {
        var chunkData = B64str.slice(i*chunkLength, (i+1)*chunkLength);

        var uploadChunk = new UploadChunk({
            data: chunkData
        });

        chunkIDs.push(uploadChunk._id.toString());
        await uploadChunk.save();
    }

    // create an uploadFile
    const uploadFile = new UploadFile({
        fileName,
        uploadDate: new Date().toISOString(),
        uploadUser: username,
        public,
        size: docSize,
        chunksAmount,
        fileType,
        metaData,
        chunks: chunkIDs
    });

    console.log(uploadFile);
    // save file
    await uploadFile.save();

    return uploadFile;
}