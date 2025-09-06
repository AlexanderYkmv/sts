import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import type { User } from "../types";

interface LoginFormProps {
  onSuccess: (user: User) => void;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

export default function LoginForm({ onSuccess }: LoginFormProps) {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await fetch("http://localhost:8080/sts/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();

            const user: User = {
              id: data.userId,
              email: data.email,
              role: data.role,
              studentId: data.studentId,
            };

            // Store user in localStorage
            localStorage.setItem("user", JSON.stringify(user));

            // Pass user to parent (AuthPage) for redirection
            onSuccess(user);
          } else {
            const msg = await response.text();
            alert(msg || "Invalid credentials");
          }
        } catch (error) {
          console.error(error);
          alert("Network error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 mt-2"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
}