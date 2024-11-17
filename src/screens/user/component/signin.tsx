import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox } from "antd";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInPost, selectErrorMessage } from "../slice/index";

interface SigninFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function Signin() {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const errorMessage = useSelector(selectErrorMessage);

  const initialValues: SigninFormValues = {
    email: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .min(5, "Email must be at least 5 characters long")
      .max(50, "Email can't exceed 50 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password can't exceed 20 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  });

  const handleSubmit = async (
    values: SigninFormValues,
    { setSubmitting, resetForm }: FormikHelpers<SigninFormValues>
  ) => {
    try {
      const response = await dispatch(
        signInPost({ email: values.email, password: values.password })
      ).unwrap();
  
      console.log("Login successful:", response);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false); 
      resetForm();
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form className="signin-form">
              <h2 style={{paddingBottom:"15px"}}>Signin</h2>

              <div className="input-group">
                <Field name="email">
                  {({ field }: { field: any }) => (
                    <Input
                      {...field}
                      prefix={
                        <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      placeholder="Enter your email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="input-group">
                <Field name="password">
                  {({ field }: { field: any }) => (
                    <Input.Password
                      {...field}
                      prefix={
                        <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      placeholder="Enter your password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="remember-me">
                <Field
                  name="remember"
                  type="checkbox"
                  as={Checkbox}
                  checked={values.remember}
                >
                  Remember me
                </Field>
              </div>

              {errorMessage && (
                <div
                  className="error-message"
                  style={{ color: "red", marginBottom: "10px" }}
                >
                  {errorMessage}
                </div>
              )}

              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
                block
                loading={isSubmitting}
              >
                {isSubmitting ? "" : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
