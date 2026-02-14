import * as yup from "yup";

export const createValidationSchema = (isEdit: boolean = false) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for first name")
      .max(50, "First name cannot be longer than 50 characters"),

    lastName: yup
      .string()
      .required("Last name is required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for last name")
      .max(50, "Last name cannot be longer than 50 characters"),

    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format")
      .max(100, "Email cannot be longer than 100 characters"),

    nic: yup
      .string()
      .required("NIC is required")
      .matches(
        /^([0-9]{9}[xXvV]|[0-9]{12})$/,
        "Invalid NIC format (Valid formats: 123456789V or 123456789012)",
      ),

    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

    role: yup
      .string()
      .required("Role is required")
      .test("not-empty", "Role is required", (value) => value !== "")
      .oneOf(["admin", "warden", "lecturer"], "Please select a valid role"),

    password: isEdit
      ? yup
          .string()
          .optional()
          .test(
            "password-validation",
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@$!%*?&#)",
            (value) => {
              if (!value || value.length === 0) return true; // Allow empty in edit mode
              return (
                value.length >= 8 &&
                /[a-z]/.test(value) &&
                /[A-Z]/.test(value) &&
                /\d/.test(value) &&
                /[@$!%*?&#]/.test(value)
              );
            },
          )
      : yup
          .string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters long")
          .matches(
            /[a-z]/,
            "Password must include at least one lowercase letter",
          )
          .matches(
            /[A-Z]/,
            "Password must include at least one uppercase letter",
          )
          .matches(/\d/, "Password must include at least one number")
          .matches(
            /[@$!%*?&#]/,
            "Password must include at least one special character (@$!%*?&#)",
          ),

    confirmPassword: yup.string().when("password", {
      is: (value: string) => value && value.length > 0,
      then: (schema) =>
        schema
          .required("Please confirm your password")
          .oneOf([yup.ref("password")], "Passwords must match"),
      otherwise: (schema) => schema.optional(),
    }),
  });

const validationSchema = createValidationSchema(false);

export default validationSchema;

export type UserRegistration = yup.InferType<
  ReturnType<typeof createValidationSchema>
>;
