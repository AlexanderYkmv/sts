import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

type SignUpFormProps = { onSuccess: () => void };

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password too short").required("Required"),
  role: Yup.mixed<"Student" | "Tutor" | "Vice_Dean">()
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
        role: "Student" as "Student" | "Tutor" | "Vice_Dean",
      }}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await fetch("http://localhost:8080/sts/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            // go straight where BE says
            if (data.redirect) {
              window.location.href = data.redirect;
            } else {
              onSuccess();
            }
          } else {
            const msg = await res.text();
            alert(msg || "Failed to register");
          }
        } catch (e) {
          console.error(e);
          alert("Network error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <Field
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
          </div>

          <Field
            as="select"
            name="role"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
            <option value="Vice_Dean">Vice Dean</option>
          </Field>
          <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />

          {/* Access code UI removed for now since BE doesn't use it yet */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 mt-2"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </Form>
      )}
    </Formik>
  );
}