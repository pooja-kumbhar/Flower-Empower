import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./pages/AppLayout";
import ErrorPage from "./pages/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPassword from "./pages/NewPassword";
import Registration from "./pages/Registration";
import RegistrationValidation from "./pages/RegistrationValidation";
import Event from "./pages/Event";
import Addresses from "./pages/Addresses";
import Volunteers from "./pages/Volunteers";
import AdminPage from "./pages/AdminPage";
import PagesProtection from "./pages/PagesProtection";
import { useCookies } from "react-cookie";
import EventPage from "./pages/EventPage";

function App() {
  const [cookies] = useCookies(["user"]);
  const token = cookies.token;
  const is_superuser = cookies.issuperuser;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/events"
            element={token ? <Event /> : <PagesProtection />}
          />
          <Route
            path="/events/:evId"
            element={token ? <EventPage /> : <PagesProtection />}
          />

          <Route
            path="/recipients"
            element={is_superuser ? <Addresses /> : <AdminPage />}
          />
          <Route
            path="/volunteers"
            element={is_superuser ? <Volunteers /> : <AdminPage />}
          />

          <Route path="/signup" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route
            path="/registration-validation"
            element={<RegistrationValidation />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 4000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "black",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
