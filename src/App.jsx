import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import OverviewPage from "./pages/OverviewPage";
import HospitalsPage from "./pages/HospitalsPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import TransfersPage from "./pages/TransfersPage";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/Overview" element={<OverviewPage />} />
        <Route path="/Hospitals" element={<HospitalsPage />} />
        <Route path="/Users" element={<UsersPage />} />
        <Route path="/Transfers" element={<TransfersPage />} />
      </Route>

    </Routes>
  );
}

export default App;

