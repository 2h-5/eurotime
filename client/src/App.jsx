import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import CreateList from "./pages/CreateList";
import Login from "./pages/Login";
import UpdatePwd from "./pages/UpdatePwd";
import SiteManager from "./pages/SiteManager";
import Register from "./pages/Register";
import VerifyEmail from "./pages/verifyEmail";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import SP from "./components/SP";
import AUP from "./components/AUP";
import DP from "./components/DP";
import Form from "./components/Form";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/updatePwd" element={<UpdatePwd />} />
            <Route path="/register" element={<Register />} />
            <Route path="/siteManager" element={<SiteManager />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path="/createList" element={<CreateList />} />
            <Route path="/SP" element={<SP />} />
            <Route path="/AUP" element={<AUP />} />
            <Route path="/DP" element={<DP />} />
            <Route path="app" element={<AppLayout />}>
              <Route index element={<Navigate replace to="cities" />} />

              <Route path="cities" element={<CityList />} />
              <Route path="countries" element={<CountryList />} />

              <Route path="cities/:id" element={<City />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
