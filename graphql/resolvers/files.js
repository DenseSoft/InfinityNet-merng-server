const { AuthenticationError } = require('apollo-server');
const path = require('path');
fs = require('fs');

const checkAuth = require('../../util/check-auth');
const uploadFile = require('../../util/uploadFile');
const UploadFile = require('../../models/uploadFile');
const UploadChunk = require('../../models/uploadChunk');
const downloadFile = require('../../util/downloadFile');
const streamToBuffer = require('../../util/streamToBuffer');

module.exports = {
    Mutation: {
        async uploadFile(_, { file }, context) {
            try{
                const { username } = checkAuth(context);

                const { createReadStream, filename, encoding } = await file;

                const stream = createReadStream();
                const fileData = await streamToBuffer(stream);
                const extensionArray = filename.split('.');
                const extension = extensionArray[extensionArray.length - 1];
                console.log(fileData.toString('base64').length);

                // uploadFile(stream, filename, extension, metaData, username, public)
                const str = uploadFile(fileData, filename, extension, encoding, username, false);

                return str;
            } catch(err) {
                throw new Error(err);
            }
        },
        async deleteFile(_, { fileId }, context) {
            const { username } = checkAuth(context);

            const uploadFile = await UploadFile.findById(fileId);
            if (username !== uploadFile.uploadUser) {
                throw new AuthenticationError("Unauthorized user");
            }

            const { chunks } = uploadFile;

            for(chunk in chunks){
                var uploadChunk = await UploadChunk.findById(chunks[chunk]);
                await uploadChunk.remove();
            }

            await uploadFile.remove();

            return 'File successfully deleted';
        },
        async uploadImage(parent, { file }) {
            try {
                const { createReadStream, filename, mimetype, encoding } = await file;

                const stream = createReadStream();
                const pathname = path.join(__dirname, `/images/${filename}`);
                await stream.pipe(fs.createWriteStream(pathname));

                return `http://localhost:4000/images/${filename}`;
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Query: {
        async getFile(_, { id }, context) {
            try {
                const { username } = checkAuth(context);

                const uploadFile = await UploadFile.findById(id);
                if (username !== uploadFile.uploadUser) {
                    throw new AuthenticationError("Unauthorized user");
                }

                const image = await UploadFile.findById(id);

                const B64str = (await downloadFile(image)).toString('base64');

                const bitmap = new Buffer.from(B64str, 'base64');
                fs.writeFileSync('test2.png', bitmap, function (err) {
                    if (err) return console.log(err);
                });

                return ({
                    id: image.id,
                    fileName: image.fileName,
                    uploadDate: image.uploadDate,
                    uploadUser: image.uploadUser,
                    public: image.public,
                    size: image.size,
                    fileType: image.fileType,
                    metaData: image.metaData,
                    data: B64str
                });
            } catch(err) {
                throw new Error(err);
            }
        }
    }
}