import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const SignUp = () => {
  const { signUp, loading, error } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-600">Second Brain</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="yourname"
        />
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
          placeholder="min 6 characters"
        />

        <Button
          variant="primary"
          size="md"
          text={loading ? "Creating..." : "Create Account"}
          onClick={() => signUp(form.username, form.email, form.password)}
          disabled={loading}
          fullWidth
        />

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

//export signUp
export default SignUp;
