import React from "react";
import UserList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Alex johnson",
      image:
        "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2019/01/Eiffel-Tower.jpg",
      places: "3",
    },
  ];

  return <UserList items={USERS} />;
};

export default Users;
