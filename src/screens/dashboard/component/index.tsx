import React, { useEffect, useState } from "react";
import { Table, Button, Input, Avatar, Spin, Alert, Card, Radio, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchUsers } from "../slice";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserModal, { UserFormValues } from "./userModel";

const { Search } = Input;
const { Meta } = Card;

const UsersPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [initialValues, setInitialValues] = useState<UserFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    profileImageLink: "",
  });
  const [viewMode, setViewMode] = useState<"table" | "card">("table"); // Toggle between Table and Card views

  const dispatch = useDispatch<AppDispatch>();
  const { data: users, isLoading, isError, errorMessage, pagination } = useSelector(
    (state: RootState) => ({
      data: state.users?.users || [],
      isLoading: state.users?.isLoading || false,
      isError: state.users?.isError || false,
      errorMessage: state.users?.errorMessage || null,
      pagination: state.users?.pagination || { page: 1, per_page: 5, total: 0, total_pages: 0 },
    })
  );

  useEffect(() => {
    if (pagination?.page) {
      dispatch(fetchUsers({ page: pagination.page }));
    }
  }, [dispatch, pagination?.page]);

  const handleCreateUser = () => {
    setModalTitle("Create New User");
    setInitialValues({ firstName: "", lastName: "", email: "", profileImageLink: "" });
    setModalVisible(true);
  };

  const handleEditUser = (user: UserFormValues) => {
    setModalTitle("Edit User");
    setInitialValues(user);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = (values: UserFormValues) => {
    console.log("Submitted Values:", values);
    setModalVisible(false);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete user with id: ${id}`);
  };

  const handleViewChange = (e: any) => {
    setViewMode(e.target.value);
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => <Avatar src={avatar} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <Button
            type="primary"
            onClick={() =>
              handleEditUser({
                firstName: record.first_name,
                lastName: record.last_name,
                email: record.email,
                profileImageLink: record.avatar,
              })
            }
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Search placeholder="Search users" onSearch={(value) => console.log(value)} enterButton />
        <Space>
          <Radio.Group value={viewMode} onChange={handleViewChange}>
            <Radio.Button value="table">Table View</Radio.Button>
            <Radio.Button value="card">Card View</Radio.Button>
          </Radio.Group>
          <Button type="primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Space>
      </div>

      {isError && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />}
      {isLoading ? (
        <Spin size="large" />
      ) : viewMode === "table" ? (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.per_page,
            onChange: (page) => dispatch(fetchUsers({ page })),
          }}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            padding: "16px",
          }}
        >
          {users.map((user, index) => (
            <Card
              key={index}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
              cover={<Avatar src={user.avatar} size={100} style={{ margin: "16px auto" }} />}
              actions={[
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() =>
                    handleEditUser({
                      firstName: user.first_name,
                      lastName: user.last_name,
                      email: user.email,
                      profileImageLink: user.avatar,
                    })
                  }
                  key="edit"
                />,
                <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  danger
                  onClick={() => handleDelete(user.id)}
                  key="delete"
                />,
              ]}
            >
              <Meta
                title={`${user.first_name} ${user.last_name}`}
                description={user.email}
                style={{ textAlign: "center" }}
              />
            </Card>
          ))}
        </div>
      )}

      <UserModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        title={modalTitle}
      />
    </div>
  );
};

export default UsersPage;
