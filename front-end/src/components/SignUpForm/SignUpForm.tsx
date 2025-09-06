import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

interface SignUpFormProps {
  onSuccess: () => void;
}

// Validation schema
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
  role: Yup.string()
    .oneOf(["Student", "Tutor", "Vice_Dean"])
    .required("Required"),
});

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Student",
      }}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await fetch("http://localhost:8080/sts/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              role: values.role,
            }),
            credentials: "include",
          });

          if (response.ok) {
            alert("Registration successful! Please log in.");
            onSuccess();
          } else {
            const msg = await response.text();
            alert(msg || "Registration failed");
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
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Field
              as="select"
              name="role"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Student">Student</option>
              <option value="Tutor">Tutor</option>
              <option value="Vice_Dean">Vice Dean</option>
            </Field>
            <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 mt-2"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </Form>
      )}
    </Formik>
  );
}