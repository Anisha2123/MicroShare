import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import CreateTip from "./pages/CreateTip";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import MobileBottomNav from "./components/MobileBottomNav";


const App = () => {
  const token = localStorage.getItem("token");
  
  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen text-gray-800">
        {/* Show Navbar only if logged in */}
        {token && <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-tip"
            element={
              <PrivateRoute>
                <CreateTip />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile  />
              </PrivateRoute>
            }
          />
          {/* Default route */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
          
        </Routes>
        <MobileBottomNav />
      </div>
    </Router>
  );
};

export default App;
