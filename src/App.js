import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Connection from "./Pages/Connection";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Connection} />
    </div>
  );
}

export default App;
