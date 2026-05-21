import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Home from "./components/Home";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import ForgotPassword from "./components/ForgotPassword";
import Chat from "./components/Chat";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2400}
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss={false}
        toastStyle={{
          background: "rgba(255, 248, 241, 0.96)",
          color: "#322117",
          border: "1px solid rgba(203, 100, 29, 0.14)",
          borderRadius: "18px",
          boxShadow: "0 14px 32px rgba(138, 74, 27, 0.12)",
        }}
        progressStyle={{
          background: "linear-gradient(135deg, #e88030, #f3b36a)",
        }}
      />
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
