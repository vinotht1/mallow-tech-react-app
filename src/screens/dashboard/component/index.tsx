import React, { useEffect } from "react";
import { Table, Button, Input, Avatar, Spin, Alert } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchUsers } from "../slice";

const { Search } = Input;

const UsersPage = () => {
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
            onClick={() => handleEdit(record.id)}
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

  const handleEdit = (id: number) => {
    console.log(`Edit user with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete user with id: ${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Search placeholder="Search users" onSearch={(value) => console.log(value)} enterButton />
        <Button type="primary">Create User</Button>
      </div>
      {isError && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />}
      {isLoading ? (
        <Spin size="large" />
      ) : (
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
      )}
    </div>
  );
};

export default UsersPage;
