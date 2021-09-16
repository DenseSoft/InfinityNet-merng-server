const UploadChunk = require('../models/uploadChunk');

module.exports = async function downloadFile(file) {
    const { chunks } = file;

    var B64str = "";

    for(chunk in chunks) {
        var uploadChunk = await UploadChunk.findById(chunks[chunk]);

        B64str = B64str + uploadChunk.data;
    }

    return B64str;
}