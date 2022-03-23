import { Route, Routes } from "react-router-dom";

import { Deliver } from "./pages/Deliver";
import { Deliveries } from "./pages/Deliveries";
import { SignIn } from "./pages/SignIn";
import { Student } from "./pages/Student";
import { Tasks } from "./pages/Tasks";
import { CreateTask } from "./pages/CreateTask";
import { Splash } from "./pages/Splash";


export function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Tasks />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/register" element={<CreateTask />} />
      <Route path="/deliver/:id" element={<Deliver />} />
      <Route path="/deliveries/:id" element={<Deliveries />} />
      <Route path="/student/:id" element={<Student />} />
      <Route path="/splash" element={<Splash />} />
    </Routes>
  );
}