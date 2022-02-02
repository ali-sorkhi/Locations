import React from "react";
import UserList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Alex johnson",
      image:
        "https://photo-cdn2.icons8.com/99L3mO3yHI4fFvBl_QpK3x38RVKTTyGUAzVrtiF8GtM/rs:fit:715:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNzIvNTI0Nzg4/MjctMzViMy00Y2Q2/LWJjM2YtNTMwYmZk/YmVkZTM4LmpwZw.jpg",
      places: "3",
    },
    {
      id: "u2",
      name: "emily michigan",
      image:
        "https://photo-cdn2.icons8.com/XGYUDcGGnHuzyR3eaNeLAa5LQfpo_JdwnKYGaIwbjP8/rs:fit:804:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNzY5LzhiMTYy/NDU3LTkxN2UtNDVm/Ni1iYjhjLTE2YmQy/MmYyODU1Zi5qcGc.jpg",
      places: "4",
    },
  ];

  return <UserList items={USERS} />;
};

export default Users;
