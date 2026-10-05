import { useEffect, useState } from "react";

function App() {
  // =========================
  // STATES
  // =========================

  // Users ki list
  const [users, setUsers] = useState([]);

  // Form ki values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  // Jis user ko edit kar rahe hain uski ID
  const [editingId, setEditingId] = useState(null);

  // =========================
  // GET API
  // =========================

  useEffect(() => {
    fetch("https://localhost:7117/api/UsersApi")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // =========================
  // POST API - ADD USER
  // =========================

  const handleAddUser = () => {
    const newUser = {
      name: name,
      email: email,
      city: city
    };

    fetch("https://localhost:7117/api/UsersApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User added:", data);

        // List me new user add karo
        setUsers([...users, data]);

        // Form clear
        setName("");
        setEmail("");
        setCity("");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  // =========================
  // EDIT BUTTON
  // =========================

  const handleEdit = (user) => {
    // User ki ID save karo
    setEditingId(user.id);

    // Existing data form me lao
    setName(user.name);
    setEmail(user.email);
    setCity(user.city);
  };

  // =========================
  // PUT API - UPDATE USER
  // =========================

  const handleUpdateUser = () => {
    const updatedUser = {
      name: name,
      email: email,
      city: city
    };

    fetch(`https://localhost:7117/api/WrongUsersApi/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUser)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User updated:", data);

        // React list me updated user replace karo
        setUsers(
          users.map((user) =>
            user.id === editingId ? data : user
          )
        );

        // Edit mode band
        setEditingId(null);

        // Form clear
        setName("");
        setEmail("");
        setCity("");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  // =========================
  // DELETE API - DELETE USER
  // =========================

  const handleDelete = (id) => {
    fetch(`https://localhost:7117/wrongapi/WrongUsersApi/${id}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User deleted:", data);

        // React list se deleted user remove karo
        setUsers(
          users.filter((user) => user.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // =========================
  // UI
  // =========================

  return (
    <div>
      <h1>Users from Database</h1>

      <h2>
        {editingId ? "Edit User" : "Add New User"}
      </h2>

      {/* Name */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      {/* City */}
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <br />
      <br />

      {/* Add / Update Button */}
      {editingId ? (
        <button onClick={handleUpdateUser}>
          Update User
        </button>
      ) : (
        <button onClick={handleAddUser}>
          Add User
        </button>
      )}

      <h2>Users</h2>

      {/* Users List */}
      {users.map((user) => (
        <p key={user.id}>
          {user.id} - {user.name} - {user.email} - {user.city}

          {" "}

          {/* Edit Button */}
          <button onClick={() => handleEdit(user)}>
            Edit
          </button>

          {" "}

          {/* Delete Button */}
          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </p>
      ))}
    </div>
  );
}

export default App;