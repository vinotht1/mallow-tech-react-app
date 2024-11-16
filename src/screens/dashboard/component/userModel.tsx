import React, { useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup"; 

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
  initialValues: UserFormValues;
  title: string;
}

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  profileImageLink: string;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,
}) => {
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    profileImageLink: Yup.string()
      .url("Invalid URL")
      .required("Profile image link is required"),
  });

  const formik = useFormik<UserFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={() => {
        formik.resetForm();
        onCancel();
      }}
      footer={null}
    >
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>First Name</label>
          <Input
            name="firstName"
            placeholder="Enter first name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div style={{ color: "red" }}>{formik.errors.firstName}</div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Last Name</label>
          <Input
            name="lastName"
            placeholder="Enter last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div style={{ color: "red" }}>{formik.errors.lastName}</div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <Input
            name="email"
            placeholder="Enter email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Profile Image Link</label>
          <Input
            name="profileImageLink"
            placeholder="Enter profile image link"
            value={formik.values.profileImageLink}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.profileImageLink && formik.errors.profileImageLink && (
            <div style={{ color: "red" }}>{formik.errors.profileImageLink}</div>
          )}
        </div>

        <div>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Submit
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
