import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Content from "./pages/Content";
import ContentDetail from "./pages/ContentDetail";
import Doubts from "./pages/Doubts";
import Seminars from "./pages/Seminars";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import PhilosopherProfile from "./pages/PhilosopherProfile";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content" element={<Content />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/seminars" element={<Seminars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/philosopher-profile" element={<PhilosopherProfile />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
