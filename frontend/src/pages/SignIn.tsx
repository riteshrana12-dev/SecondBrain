// src/pages/SignIn.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../api/axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/signin", form);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-purple-600 text-center">
          Second Brain
        </h1>
        <p className="text-gray-600 text-sm text-center">
          Sign in to your account
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        <Button
          variant="primary"
          size="md"
          text={loading ? "Signing in..." : "Sign In"}
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        />

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
