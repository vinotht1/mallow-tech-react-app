import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Avatar,
  Spin,
  Alert,
  Card,
  Radio,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../slice";
import {
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../../middleware/apiFunctions";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserModal, { UserFormValues } from "./userModel";
import "../styles/index.css";

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
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    isError,
    errorMessage,
    pagination,
  } = useSelector((state: RootState) => ({
    data: state.users?.users || [],
    isLoading: state.users?.isLoading || false,
    isError: state.users?.isError || false,
    errorMessage: state.users?.errorMessage || null,
    pagination: state.users?.pagination || {
      page: 1,
      per_page: 5,
      total: 0,
      total_pages: 0,
    },
  }));

  useEffect(() => {
    const userSession = sessionStorage.getItem("accessToken");
    if (!userSession) {
      navigate("/"); 
    } else {
      if (pagination?.page) {
        dispatch(fetchUsers({ page: pagination.page }));
      }
    }
  }, [dispatch, navigate, pagination?.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        const filtered = users.filter(
          (user) =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, users]);

  const handleCreateUser = () => {
    setModalTitle("Create New User");
    setInitialValues({
      firstName: "",
      lastName: "",
      email: "",
      profileImageLink: "",
    });
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

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (modalTitle.includes("Edit")) {
        await updateUserApi(values.id!, {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          avatar: values.profileImageLink,
        });
      } else {
        await createUserApi({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          avatar: values.profileImageLink,
        });
      }
      dispatch(fetchUsers({ page: pagination?.page || 1 }));
    } catch (error) {
      console.error("User operation failed:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserApi(id);
      dispatch(fetchUsers({ page: pagination?.page || 1 }));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
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
        <div className="action-btn-section">
          <Button
            type="primary"
            onClick={() =>
              handleEditUser({
                id: record.id,
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
        </div>
      ),
    },
  ];

  return (
    <div className="user-container">
      <div className="header">
        <h1>Users</h1>
      </div>

      <div className="search-bar">
        <Search
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          enterButton
        />
        <Button type="primary" onClick={handleCreateUser} className="create-user-button">
          Create User
        </Button>
      </div>
      <div className="table-card-toggle">
        <Radio.Group value={viewMode} onChange={handleViewChange}>
          <Radio.Button value="table">Table View</Radio.Button>
          <Radio.Button value="card">Card View</Radio.Button>
        </Radio.Group>
      </div>

      {isError && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {isLoading ? (
        <Spin size="large" />
      ) : viewMode === "table" ? (
        <Table
          dataSource={filteredUsers}
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
          {filteredUsers.map((user, index) => (
            <Card
              key={index}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
              cover={
                <Avatar
                  src={user.avatar}
                  size={100}
                  style={{ margin: "16px auto" }}
                />
              }
              actions={[
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() =>
                    handleEditUser({
                      id: user.id,
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
