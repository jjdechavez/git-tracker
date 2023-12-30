import { Router, Route } from "@solidjs/router";
import SigninRoute from "./routes/signin";

function App() {
  return (
    <Router>
      <Route path="/" component={() => <div>Home Page</div>} />
      <Route path="/about" component={() => <div>About Page</div>} />
      <Route path="/signin" component={SigninRoute} />
    </Router>
  );
}

export default App;
