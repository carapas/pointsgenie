import { Store } from "flummox";

class BaseStore extends Store {
  constructor(flux, initialState) {
    super();
    this.state = initialState;
  }

  getInitialState() {
    return {};
  }

  handleBeginAsyncRequest() {
    console.log("beginRequest");
    this.setState({ isLoading: true });
  }

  handleFinishAsyncRequest() {
    console.log("finish");
    this.setState({ isLoading: false });
  }

  handleErrorAsyncRequest(err) {
    console.log("error");
    this.setState({ isLoading: false });
  }

  isLoading() {
    return this.state.isLoading;
  }
}

export default BaseStore;
