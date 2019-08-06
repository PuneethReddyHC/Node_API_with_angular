var Event = require("../models/event");

module.exports = {

    add_event: function (data, callback) {
        eventdata = function () {

            Event.findOne({
                "event_id": data.event_id
            }, function (err, eventdata) {
                if (err) {
                    callback({
                        statuscode: 500,
                        error: err,
                        msg: "finding event_id database error"
                    });
                } else if (eventdata != null) {
                    callback({
                        statuscode: 304,
                        msg: "Event already exist"
                    });

                } else {
                    var addevent = new Event();
                    addevent.event_id = data.event_id;
                    addevent.event_name = data.event_name;
                    addevent.save(function (err, result) {
                        if (err) {
                            callback({
                                statuscode: 500,
                                error: err,
                                msg: "saving event, database error"
                            });
                        } else {
                            callback({
                                statuscode: 200,
                                msg: "Event added successfully",
                                data: addevent
                            });
                        }
                    });

                }
            });




        }
        process.nextTick(eventdata);
    },


    get_event: function (data, callback) {
        eventData = function () {
            Event.findOne({
                "event_id": data.event_id
            }, function (err, events) {
                if (err) {
                    callback({
                        msg: "Finding event_id from database , an error",
                        statuscode: 500,
                    });
                } else if (events == null) {
                    callback({
                        msg: "event_id does not exist",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "Event details",
                    statuscode: 200,
                    data: events
                });
            });
        }
        process.nextTick(eventData);
    },

    list_events: function (callback) {
        eventData = function () {
            Event.find({}, function (err, events) {
                if (err) {
                    callback({
                        msg: "Finding events from database , an error",
                        statuscode: 500,
                    });
                } else if (events == null) {
                    callback({
                        msg: "No events found",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "List of events",
                    statuscode: 200,
                    data: events
                });
            });
        }
        process.nextTick(eventData);
    },
    delete_event: function (data, callback) {
        eventData = function () {
            Event.remove({
                "event_id": data.event_id
            }, function (err, events) {
                if (err) {
                    callback({
                        msg: "Finding event_id from database , an error",
                        statuscode: 500,
                    });
                } else if (events == null) {
                    callback({
                        msg: "event_id does not exist",
                        statuscode: 404,
                    });
                }
                callback({
                    msg: "Event deleted successfully",
                    statuscode: 200
                });
            });
        }
        process.nextTick(eventData);
    },

    edit_event: function (data, callback) {
        eventData = function () {
            Event.findOneAndUpdate({
                "event_id": data.event_id
            }, {
                    $set: {
                        "event_name": data.event_name
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
                            msg: "Event added successfully",
                            data: result
                        });
                    }
                });
        }
        process.nextTick(eventData);
    }


}
