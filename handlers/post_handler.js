var Post = require("../models/post");

module.exports = {

    add_post: function (data, callback) {
        postdata = function () {
            var addpost = new Post();
            var date = new Date();
            
            addpost.postId = data.postId; 
            addpost.title = data.title;
            addpost.description = data.description;
            addpost.images = data.images;
            addpost.createdAt = date.toUTCString();
            addpost.save(function (err, result) {
                if (err) {
                    callback({
                        statuscode: 500,
                        error: err,
                        msg: "saving post, database error"
                    });
                } else {
                    callback({
                        statuscode: 200,
                        msg: "post added successfully",
                        data: addpost
                    });
                }
            });
        }
        process.nextTick(postdata);
    },


    get_post: function (data, callback) {
        postData = function () {
            console.log('get_post  '  +data);
            Post.findOne({
                "postId": data.postId
            }, function (err, posts) {
                if (err) {
                    callback({
                        msg: "Finding post_id from database , an error",
                        statuscode: 500,
                    });
                } else if (posts == null) {
                    callback({
                        msg: "post_id does not exist",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "post details",
                    statuscode: 200,
                    data: posts
                });
            });
        }
        process.nextTick(postData);
    },

    list_posts: function (callback) {
        postData = function () {

            Post.find({}, function (err, posts) {
                if (err) {
                    callback({
                        msg: "Finding posts from database , an error",
                        statuscode: 500,
                    });
                } else if (posts == null) {
                    callback({
                        msg: "No posts found",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "List of posts",
                    statuscode: 200,
                    data: posts
                });
            });
        }
        process.nextTick(postData);
    },
    delete_post: function (data, callback) {
        postData = function () {
            console.log('delete_post  '  +data);
            Post.remove({
                "postId": data.postId
            }, function (err, posts) {
                if (err) {
                    callback({
                        msg: "Finding post_id from database , an error",
                        statuscode: 500,
                    });
                } else if (posts == null) {
                    callback({
                        msg: "post_id does not exist",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "post deleted successfully",
                    statuscode: 200
                });
            });
        }
        process.nextTick(postData);
    },

    edit_post: function (data, callback) {
        postData = function () {
            console.log('edit_post  '  +data);
            var date = new Date();
            var editedAt = date.toUTCString();
            Post.findOneAndUpdate({
                "postId": data.postId
            }, {
                    $set: {
                        "title": data.title,
                        "description": data.description,
                        "images" : data.images,
                        "editedAt": editedAt,
                    }
                }, {
                    upsert: false,
                    new: true
                }, function (err, result) {
                    if (err) {
                        callback({
                            statuscode: 500,
                            msg: "database err "
                        });
                    }
                    else {
                        callback({
                            statuscode: 200,
                            msg: "post added successfully",
                            data: result
                        });
                    }
                });
        }
        process.nextTick(postData);
    },

    edit_views : function (data, callback) {
        
        postData = function () {
            console.log('edit_views  '  +data);
            var currentuser= localStorage.getItem('currentuser');
            Post.findOneAndUpdate({
                "postId": data.postId
            }, {
                    $set: {
                        "views": {
                            "user_id" : currentuser.id , 
                        }
                    }
                }, {
                    upsert: false,
                    new: true
                }, function (err, result) {
                    if (err) {
                        callback({
                            statuscode: 500,
                            msg: "database err "
                        });
                    }
                    else {
                        callback({
                            statuscode: 200,
                            msg: "post viewed successfully",
                            data: result
                        });
                    }
                });
        }
        process.nextTick(postData);
    }


}