var mongoose = require('mongoose');
const Application = mongoose.model("Application");
const Event = mongoose.model("Event");

export default {
  fetchUserApplications(user) {
    return Application
      .find({ user }).exec()
      .then(applications => {
        const eventIds = applications.map(application => application.event);
        return Event.find({ _id: { $in: eventIds } }).exec()
          .then(events => {
            return {
              applications,
              events,
            };
          });
      });
  }
};
