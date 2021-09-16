const { model, Schema } = require('mongoose');

const uploadFileSchema = new Schema({
    fileName: String,
    uploadDate: String,
    uploadUser: String,
    public: Boolean,
    size: Number,
    chunksAmount: Number,
    fileType: String,
    metaData: String,
    chunks: [String]
});

module.exports = model('UploadFile', uploadFileSchema);