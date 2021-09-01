import { BrowserRouter, Switch, Route } from "react-router-dom";

import { AdminIndex } from "../pages/admin/AdminIndex";

export default function render() {
  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route path="/admin/index" exact component={AdminIndex}></Route>
      </Switch>
    </BrowserRouter>
  );
}
