var mongoose = require("mongoose");
const Event = mongoose.model("Event");
const Application = mongoose.model("Application");
const User = mongoose.model("User");
const { ObjectId } = mongoose.Types;

import ApplicationApi from "../api/ApplicationApi";

import { getNextHourDate, addHours } from "../../lib/date-helper.js";

exports.create = function *() {
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  const { application, event } = this.request.body;
  if (!application || !application.availabilities || application.availabilities.length < 1) {
    this.throw("Une postulance doit contenir au moins une disponibilité", 400);
  }

  const applicationEvent = yield Event.findById(event).exec();
  if (!applicationEvent) {
    this.throw("L'événement n'existe pas", 500);
  }

  if (applicationEvent.isClosed || application.isClosedToPublic) {
    this.throw("Impossible de postuler sur un événement fermé", 500);
  }

  if (applicationEvent.endDate.getTime() < getNextHourDate().getTime()) {
    this.throw("Impossible de postuler sur un événement passé", 500);
  }

  if (!isValidAvailabilites(application.availabilities, applicationEvent)) {
    this.throw("Les heures de disponibilité sont invalides");
  }

  let newApplication = new Application({
    user: this.passport.user,
    event: event,
    preferredTask: application.preferredTask,
    availabilities: application.availabilities,
  });

  yield newApplication.save();
  this.body = { application: newApplication };
};

exports.update = function *() {
    const { id } = this.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    this.throw("L'événement n'existe pas", 404);
  }
  let currentApplication = yield Application.findById(id).exec();
  if (!currentApplication) {
    this.throw("La postulation n'existe pas", 404);
  }
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  const { application } = this.request.body;
  if (!application || !application.availabilities || application.availabilities.length < 1) {
    this.throw("Une postulance doit contenir au moins une disponibilité", 400);
  }

  const applicationEvent = yield Event.findById(currentApplication.event).exec();
  if (!applicationEvent) {
    this.throw("L'événement n'existe pas", 500);
  }

  if (applicationEvent.isClosed || application.isClosedToPublic) {
    this.throw("Impossible de postuler sur un événement fermé", 500);
  }

  if (applicationEvent.endDate.getTime() < getNextHourDate().getTime()) {
    this.throw("Impossible de postuler sur un événement passé", 500);
  }

  if (!isValidAvailabilites(application.availabilities, applicationEvent)) {
    this.throw("Les heures de disponibilité sont invalides");
  }

  currentApplication.preferredTask = application.preferredTask;
  currentApplication.availabilities = application.availabilities;
  yield currentApplication.save();
  this.body = { application: currentApplication };
};

exports.delete = function *() {
  const { id } = this.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    this.throw("Erreur dans l'ID", 404);
  }
  let currentApplication = yield Application.findById(id).exec();
  if (!currentApplication) {
    this.throw("La postulation n'existe pas", 404);
  }

  if ((!this.passport.user.meta.isAdmin) || (currentApplication.user != this.passport.user.id)) {
    this.throw("Seul le postulant peut supprimer sa postulation.");
  }


  const applicationEvent = yield Event.findById(currentApplication.event).exec();
  if (!applicationEvent) {
    this.throw("L'événement n'existe pas", 500);
  }

  if (applicationEvent.isClosed || applicationEvent.isClosedToPublic) {
    this.throw("Impossible de retirer une postulation fermée", 500);
  }

  if (applicationEvent.endDate.getTime() < getNextHourDate().getTime()) {
    this.throw("Impossible de retirer une postulation passée", 500);
  }

  yield Application.remove({_id: id}).exec();
  this.body = true;
}

exports.read = function *() {
  const { id } = this.params;
  const application = yield Application
    .findById(id)
    .populate("event user")
    .exec();
  this.body = {
    application,
  };
};

exports.readForUser = function *() {
  const { _id } = this.passport.user;
  const { applications, events } = yield ApplicationApi.fetchUserApplications(_id);
  this.body = {
    applications,
    events,
  };
};

exports.readForEvent = function *() {
  const applications = yield Application
  .find({ event: new ObjectId(this.params.id)})
  .exec();
  const userIds = applications.map(application => application.user);

  let users = [];
  if (userIds.length > 0) {
    users = yield User.find({ _id: { $in: userIds} }).exec();
  }
  this.body = {
    applications,
    users,
  };
};

function isValidAvailabilites(availabilities, event) {
  let obligatoryHours = event.obligatoryHours;
  let obligatoryHoursMap = {};
  let date = addHours(new Date(event.endDate.getTime()), -1);
  while(obligatoryHours > 0) {
    obligatoryHoursMap[date.getTime()] = false;
    --obligatoryHours;
    addHours(date, -1);
  }
  for (let i = 0; i < availabilities.length; ++i) {
    availabilities = new Date(availabilities);
    if (availabilities.getTime() > event.endDate || availabilities.getTime() < event.startDate) {
      return false;
    }
    obligatoryHoursMap[availabilities.getTime()] = true;
  }
  for (const hour in obligatoryHoursMap) {
    if (!hour) {
      return false;
    }
  }
  return true;
}
