import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import KhoK3 from "./pages/KhoK3";
import KhoN1 from "./pages/KhoN1";
import KhoN19 from "./pages/KhoN19";
import KhoN16 from "./pages/KhoN16";
import LenhTuDong from "./pages/LenhTuDong";
import OverlappingBarChart from "./pages/OverlappingBarChart";
import QRCodeScanner from "./pages/QRCodeScanner";
import Qr from "./pages/Qr";
import StartScreen from "./pages/StartScreen";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import PrivateRoute from "./components/PrivateRoute";

// Tạo PrivateRoute để bảo vệ các route


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/pallet" exact component={QRCodeScanner} />
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        {/* private route */}
        <Route exact path="/KhoK3_" component={KhoK3} rolesAllowed={["admin", "user"]} />
        <Route exact path="/" exact component={StartScreen} rolesAllowed={["admin"]} />
        <Route exact path="/DanhSachChuaDatHang" component={Tables} rolesAllowed={["admin"]} />
        <Route exact path="/ltd" component={LenhTuDong} rolesAllowed={["admin", "user"]} />
        <Route exact path="/qr" component={Qr} rolesAllowed={["admin", "user"]} />
        <Main>
          {/* PrivateRoute bảo vệ các route dành cho admin */}
          <Route exact path="/Dashboard" component={Home} rolesAllowed={["admin"]} />

          {/* Route dành cho user */}
          <Route exact path="/KhoK3" component={KhoK3} rolesAllowed={["admin", "user"]} />
          <Route exact path="/KhoN1" component={KhoN1} rolesAllowed={["admin", "user"]} />
          <Route exact path="/KhoN19" component={KhoN19} rolesAllowed={["admin", "user"]} />
          <Route exact path="/KhoN16" component={KhoN16} rolesAllowed={["admin", "user"]} />
          <Route exact path="/OverlappingBarChart" component={OverlappingBarChart} rolesAllowed={["admin", "user"]} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
