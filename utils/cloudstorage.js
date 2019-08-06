var config = require("../config");
var {Storage} = require('@google-cloud/storage');
var fs = require('fs');
var uuidV4 = require("../utils/utils");

const storage = new Storage({
    projectId: 'studentplatform-227507',
    keyFilename: 'studentplatform-66ad2eb0fdad.json'
});
var bucket = storage.bucket('avohi_studentplatform_123');

module.exports = {
    uploadFile: async function (data, callback) {
        let sampleFile = data;
        var date = new Date();
        var d = date.getTime();
        var fileExtension = data.name.substr((data.name.lastIndexOf('.') + 1));
        var unique_id = uuidV4.getUniqueId();
        var filename = d +unique_id+"."+fileExtension;
        await sampleFile.mv('images/google/' +filename, async function (err) {
        });
        await bucket.upload('images/google/' + filename, (err, file) => {
            if (err) {
                return console.error(err);
            }
            if (file)  {
                fs.unlink('images/google/' + filename, function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
            }
        });
        return Promise.resolve(filename);
    },

    getFile: async function (data, callback) {
        var image = data;
        const logo=await bucket.file(image).getSignedUrl({
            action: 'read',
            expires: Date.now() + 60000
        });
        return logo;
    },

    deleteFile: function (data, callback) {
        var image = data.imageName;
        var deletefile = bucket.file(image);
        deletefile.delete(function (err, img) {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted successfully");
                callback({
                    "msg": "Deleted successfully",
                    "statuscode": 204
                });
            }
        });
    }
};
