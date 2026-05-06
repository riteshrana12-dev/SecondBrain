import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SharedBrain from "./pages/SharedBrain";
import ErrorBoundary from "./components/Errorboundary"; // ← fixed path
import api from "./api/axios";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    api
      .get("/content/get")
      .then(() => setAuth("ok"))
      .catch(() => setAuth("fail"));
  }, []);

  if (auth === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );

  if (auth === "fail") return <Navigate to="/signin" />;
  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/shared/:hash" element={<SharedBrain />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ErrorBoundary>
                  <Home />
                </ErrorBoundary>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
