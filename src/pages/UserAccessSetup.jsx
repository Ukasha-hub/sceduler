import React, { useState, useEffect } from "react";

const getInitialAccessData = () => {
  const stored = localStorage.getItem("userAccess");
  return stored ? JSON.parse(stored) : [];
};

// Example access options
const accessOptions = ["Admin", "Editor", "Viewer", "Guest"];

const UserAccessSetup = () => {
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState(getInitialAccessData());
  const [formInputs, setFormInputs] = useState({ userId: "", access: "" });

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Save table data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userAccess", JSON.stringify(tableData));
  }, [tableData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formInputs.userId || !formInputs.access) {
      alert("All fields are required!");
      return;
    }

    const newRow = {
      id: Date.now(),
      userId: formInputs.userId,
      userName: users.find((u) => u.id === parseInt(formInputs.userId))?.name || "",
      access: formInputs.access,
    };

    setTableData((prev) => [...prev, newRow]);
    setFormInputs({ userId: "", access: "" });
  };

  const handleDeleteRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  return (
    <div className="flex p-2 lg:flex-row flex-col mt-4 gap-2 text-sm">
      {/* TABLE SECTION */}
      <div className="w-full lg:w-2/3 overflow-x-auto">
        <table className="table table-bordered table-hover w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>User Name</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500 italic">
                  No data
                </td>
              </tr>
            ) : (
              tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100">
                  <td>{row.userName}</td>
                  <td>{row.access}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FORM SECTION */}
      <div className="card card-primary w-full lg:w-1/3 self-start">
        <div className="card-header bg-blue-500 text-white p-2">
          <h3 className="card-title text-white">Assign Access</h3>
        </div>
        <form className="p-2" onSubmit={handleSubmit}>
        <div className="mb-4">
  <div className="relative">
    <select
      name="userId"
      value={formInputs.userId}
      onChange={handleInputChange}
      className="
        peer block w-full rounded border border-gray-300 px-2 py-2 text-sm bg-white
        focus:border-blue-500 focus:outline-none
      "
    >
      <option value="" hidden></option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>

    <label
      className="
        absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 
        bg-white px-1 text-gray-500 transition-all duration-200
        peer-focus:text-blue-500
        peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0 
        peer-placeholder-shown:scale-100
      "
    >
      User Name
    </label>
  </div>
</div>

{/* Access Floating Select */}
<div className="mb-4">
  <div className="relative">
    <select
      name="access"
      value={formInputs.access}
      onChange={handleInputChange}
      className="
        peer block w-full rounded border border-gray-300 px-2 py-2 text-sm bg-white
        focus:border-blue-500 focus:outline-none
      "
    >
      <option value="" hidden></option>
      {accessOptions.map((access) => (
        <option key={access} value={access}>
          {access}
        </option>
      ))}
    </select>

    <label
      className="
        absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 
        bg-white px-1 text-gray-500 transition-all duration-200
        peer-focus:text-blue-500
        peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0 
        peer-placeholder-shown:scale-100
      "
    >
      Access
    </label>
  </div>
</div>

          <button type="submit" className="btn btn-primary mt-2 w-full text-sm">
            Assign Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAccessSetup;
