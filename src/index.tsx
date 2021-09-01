import ReactDOM from "react-dom";
import Route from "./router/index";
import "./index.css";

const render = (Component: any) => {
  ReactDOM.render(
    <Component />,
    document.getElementById("root") as HTMLElement
  );
};
render(Route);
