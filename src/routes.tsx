import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Activities } from "./pages/Activities";
import { SignIn } from "./pages/SignIn";
import { Deliver } from "./pages/Deliver";
import { Deliveries } from "./pages/Deliveries";
import { Student } from "./pages/Student";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Activities />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/deliver/:id" element={<Deliver />} />
        <Route path="/deliveries/:id" element={<Deliveries />} />
        <Route path="/student/:id" element={<Student />} />
      </Routes>
    </BrowserRouter>

  );
}