var mongoose = require('mongoose');
const Application = mongoose.model("Application");
const Event = mongoose.model("Event");
const { ObjectId } = mongoose.Types;

import { getNextHourDate } from "../../lib/date-helper";

export default {
  fetchUpcomingEvents(user) {
    return Application.find({ user }, { event: 1 }).exec()
      .then(applications => applications.map(a => a.event))
      .then(events => {
        return Event.find({
          _id: { $nin: events },
          startDate: { $gt:  getNextHourDate()},
          isClosed: false,
          isClosedToPublic: { $ne: true },
        }).sort("startDate").exec();
      })
  }
};
