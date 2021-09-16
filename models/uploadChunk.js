const { model, Schema } = require('mongoose');

const uploadChunkSchema = new Schema({
    data: String
});

module.exports = model('UploadChunk', uploadChunkSchema);