var College = require("../models/college");

module.exports = {

    add_college: function (data, callback) {
        collegedata = function () {

            College.findOne({
                "college_id": data.college_id
            }, function (err, collegedata) {
                if (err) {
                    callback({
                        statuscode: 500,
                        error: err,
                        msg: "finding college_id database error"
                    });
                } else if (collegedata != null) {
                    callback({
                        statuscode: 304,
                        msg: "college already exist"
                    });

                } else {
                    var addcollege = new College();
                    addcollege.college_id = data.college_id;
                    addcollege.college_name = data.college_name;
                    addcollege.college_loc = data.college_loc;
                    addcollege.save(function (err, result) {
                        if (err) {
                            callback({
                                statuscode: 500,
                                error: err,
                                msg: "saving college, database error"
                            });
                        } else {
                            callback({
                                statuscode: 200,
                                msg: "College added successfully",
                                data: addcollege
                            });
                        }
                    });

                }
            });
        }
        process.nextTick(collegedata);
    },


    get_college: function (data, callback) {
        collegeData = function () {
            College.findOne({
                "collegecollege_id": data.college_id
            }, function (err, colleges) {
                if (err) {
                    callback({
                        msg: "Finding college_id from database , an error",
                        statuscode: 500,
                    });
                } else if (colleges == null) {
                    callback({
                        msg: "college_id does not exist",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "college details",
                    statuscode: 200,
                    data: colleges
                });
            });
        }
        process.nextTick(collegeData);
    },

    list_colleges: function (callback) {
        collegeData = function () {
            College.find({}, function (err, colleges) {
                if (err) {
                    callback({
                        msg: "Finding colleges from database , an error",
                        statuscode: 500,
                    });
                } else if (colleges == null) {
                    callback({
                        msg: "No colleges found",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "List of colleges",
                    statuscode: 200,
                    data: colleges
                });
            });
        }
        process.nextTick(collegeData);
    },
    delete_college: function (data, callback) {
        collegeData = function () {
            College.remove({
                "college_id": data.college_id
            }, function (err, colleges) {
                if (err) {
                    callback({
                        msg: "Finding college_id from database , an error",
                        statuscode: 500,
                    });
                } else if (colleges == null) {
                    callback({
                        msg: "college_id does not exist",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "college deleted successfully",
                    statuscode: 200
                });
            });
        }
        process.nextTick(collegeData);
    },

    edit_college: function (data, callback) {
        collegeData = function () {
            College.findOneAndUpdate({
                "college_id": data.college_id
            }, {
                    $set: {
                        "college_name": data.college_name,
                        "college_loc": data.college_loc,

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
                            msg: "college added successfully",
                            data: result
                        });
                    }
                });
        }
        process.nextTick(collegeData);
    }


}