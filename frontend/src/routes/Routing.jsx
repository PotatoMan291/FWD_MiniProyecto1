import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RutaProtegida from "./RutaProtegida";

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<RutaProtegida />}>
          <Route path="/" element={<App />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
