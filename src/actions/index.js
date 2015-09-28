import authActionsFactory from "./AuthActions";
import eventActionsFactory from "./EventActions";
import applicationActionsFactory from "./ApplicationActions";
import pollActionsFactory from "./PollActions";

export default context => ({
  AuthActions: authActionsFactory(context),
  EventActions: eventActionsFactory(context),
  ApplicationActions: applicationActionsFactory(context),
  PollActions: pollActionsFactory(context)
});
