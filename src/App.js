import "./MainStyle.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Login/Login";
import Registration from "./Login/Registration";
import Courses from "./Pages/Courses";
import BuyNow from "./Pages/BuyNow";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./helper/ScrollToTop";
import AboutUs from "./components/AboutUs";
import EnrollCourseListing from "./Pages/EnrollCourseListing";
import EnrollCourseDetail from "./Pages/EnrollCourseDetail";
import ProtectedRoute from "./helper/ProtectedRoute";
import LectureDetails from "./Pages/LectureDetails";
import MyProfile from "./Pages/MyProfile";
import Popup from "./components/Popup";
import SearchCourses from "./Pages/SearchCourses";
import Exam from "./Pages/Exam";
import ShortLink from "./Pages/ShortLink";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:link" element={<ShortLink />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/buy-now/:id" element={<BuyNow />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/search-courses/:value" element={<SearchCourses />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/enrolled-courses" element={<EnrollCourseListing />} />
            <Route path="/enrolled-courses-details/:id" element={<EnrollCourseDetail />} />
            <Route path="/lecture-detail/:id/:lecID" element={<LectureDetails />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/exam/:id" element={<Exam />} />
          </Route>
          {/* <Route path="/popup" element={<Popup />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
