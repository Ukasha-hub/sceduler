import React, { useState, useEffect } from "react";
import axios from "axios";



const UserSetup = () => {
  const [tableData, setTableData] = useState([]);
  const [activeTab, setActiveTab] = useState("primary");
  const [formInputs, setFormInputs] = useState({
    user_id: "",
    name: "",
    department: "",
    role: "",
    modules: [],
    crud: {
      isRead: false,
      isWrite: false,
      isUpdate: false,
      isDelete: false,
    },
  });

  const accessOptions = ["Admin", "Editor", "Viewer", "Guest"];
  const modulesList = ["Scheduler", "Rundown", "User Settings"];
  const crudList = ["isRead", "isWrite", "isUpdate", "isDelete"];

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/users/users`);
  
      const formatted = res.data.map((u) => ({
        id: u.id,
        user_id: u.user_id,
        name: u.name,
        department: u.department,
        role: u.role,
        modules: u.privileges.map((p) => p.module_name),
        crudMatrix: {
          isRead: Object.fromEntries(u.privileges.map(p => [p.module_name, p.can_read])),
          isWrite: Object.fromEntries(u.privileges.map(p => [p.module_name, p.can_write])),
          isUpdate: Object.fromEntries(u.privileges.map(p => [p.module_name, p.can_update])),
          isDelete: Object.fromEntries(u.privileges.map(p => [p.module_name, p.can_delete])),
        },
      }));
  
      setTableData(formatted);
    } catch (error) {
      console.log(error.response?.data);
      console.error("GET USERS FAILED:", error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormInputs({
      user_id: "",
      name: "",
      department: "",
      role: "",
      modules: [],
      crud: {
        isRead: false,
        isWrite: false,
        isUpdate: false,
        isDelete: false,
      },
    });
  };

  const handleSubmitUserSettings = async (e) => {
    e.preventDefault();
  
    if (!formInputs.user_id || !formInputs.name || !formInputs.department) {
      alert("All fields are required!");
      return;
    }
  
    // default privileges
    const defaultPrivileges = [
      {
        module_name: "Scheduler",
        can_read: true,
        can_write: false,
        can_update: false,
        can_delete: false,
      },
    ];
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/users/create`, {
        user_id: formInputs.user_id,
        name: formInputs.name,
        department: formInputs.department,
        role: formInputs.role,
        privileges: defaultPrivileges,
      });
  
      await fetchUsers(); // refresh table  
      resetForm();
      alert("User added successfully!"); 
  
    } catch (error) {
      console.log(error.response?.data);
      console.error("CREATE USER FAILED:", error);
    }
  };
  

  const handlePrivilegeSubmit = async () => {
    const privilegesPayload = modulesList.map((module) => ({
      module_name: module,
      can_read: formInputs.crudMatrix?.isRead?.[module] || false,
      can_write: formInputs.crudMatrix?.isWrite?.[module] || false,
      can_update: formInputs.crudMatrix?.isUpdate?.[module] || false,
      can_delete: formInputs.crudMatrix?.isDelete?.[module] || false,
    }));
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/users/create`, {
        user_id: formInputs.user_id,
        name: formInputs.name,
        department: formInputs.department,
        role: formInputs.role,
        privileges: privilegesPayload,
      });
  
      await fetchUsers();
      resetForm();
      alert("User added with privileges successfully!");
      setActiveTab("primary");
  
    } catch (error) {
      console.log(error.response?.data);
      console.error("CREATE USER WITH PRIVILEGES FAILED:", error);
    }
  };
  

  // PRIVILEGE TABLE HANDLER
  const togglePrivilege = (crud, mod) => {
    setFormInputs((prev) => ({
      ...prev,
      crudMatrix: {
        ...prev.crudMatrix,
        [crud]: {
          ...prev.crudMatrix?.[crud],
          [mod]: !prev.crudMatrix?.[crud]?.[mod],
        },
      },
    }));
  };
  

  // Initialize crudMatrix for privilege table
  const crudMatrix = {};
  crudList.forEach((c) => {
    crudMatrix[c] = {};
    modulesList.forEach((m) => {
      crudMatrix[c][m] = false;
    });
  });

  {/* TABLE SECTION */}
const [selectedRows, setSelectedRows] = useState([]);
const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

const handleRowClick = (id) => {
  setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
  );
};

const handleSelectAll = () => {
  if (selectedRows.length === tableData.length) {
    setSelectedRows([]);
  } else {
    setSelectedRows(tableData.map((r) => r.id));
  }
};

const handleRightClick = (e, id) => {
  e.preventDefault();
  setSelectedRows([id]); // select row before action

  const rect = e.currentTarget.closest(".table-responsive").getBoundingClientRect();

  setContextMenu({
    visible: true,
    x: e.clientX - rect.left, // relative to container
    y: e.clientY - rect.top,  // relative to container
  });
};

const handleDeleteRows = async () => {
  try {
    // Call API to delete each selected user
    await Promise.all(
      selectedRows.map((id) =>
        axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/users/users/delete/${id}`)
      )
    );

    // Refresh table
    await fetchUsers();

    // Clear selected rows and hide context menu
    setSelectedRows([]);
    setContextMenu({ ...contextMenu, visible: false });

    alert("Selected user(s) deleted successfully!");
  } catch (error) {
    console.error("DELETE USER FAILED:", error.response?.data || error);
    alert("Failed to delete user(s). Please try again.");
  }
};


const isUserSettingsFilled =
  formInputs.user_id.trim() !== "" &&
  formInputs.name.trim() !== "" &&
  formInputs.department.trim() !== "" &&
  formInputs.role.trim() !== "";

  return (
    <div className="flex gap-3 flex-col lg:flex-row mt-4 text-sm px-2">

      {/* TABLE SECTION */}
      <div className="w-full  lg:w-2/3 ">
    <div className="card">
      <div className="card-header p-2  ">
        <h3 className="card-title p-2 font-bold text-black">Users Table</h3>
      </div>

      <div className="table-responsive relative overflow-x-auto">
        <table className="table table-collapse table-hover min-w-full p-0.5">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === tableData.length &&
                    tableData.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="border-b p-2 text-left">User ID</th>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Department</th>
              <th className="border-b p-2 text-left">Role</th>
              <th className="border-b p-2 text-left">Modules</th>
              
            </tr>
          </thead>

          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.id}
                className={`cursor-pointer  hover:bg-gray-100 ${
                  selectedRows.includes(row.id) ? "bg-gray-200" : ""
                }`}
                onClick={() => handleRowClick(row.id)}
                onContextMenu={(e) => handleRightClick(e, row.id)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowClick(row.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td  className="border-t p-2">{row.user_id}</td>
                <td  className="border-t p-2">{row.name}</td>
                <td  className="border-t p-2">{row.department}</td>
                <td  className="border-t p-2">{row.role}</td>
                <td className="border-t p-2">
  <div className="flex flex-col gap-1">
    {row.modules?.map((moduleName) => (
      <div key={moduleName} className="text-xs">
        <span className="font-semibold">{moduleName}:</span>{" "}
        <span>R: {row.crudMatrix?.isRead?.[moduleName] ? "✔️" : "✘"}</span>{" "}
        <span>W: {row.crudMatrix?.isWrite?.[moduleName] ? "✔️" : "✘"}</span>{" "}
        <span>U: {row.crudMatrix?.isUpdate?.[moduleName] ? "✔️" : "✘"}</span>{" "}
        <span>D: {row.crudMatrix?.isDelete?.[moduleName] ? "✔️" : "✘"}</span>
      </div>
    ))}
  </div>
</td>
               
              </tr>
            ))}
          </tbody>
        </table>

        {/* CONTEXT MENU */}
        {contextMenu.visible && (
          <div
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: "white",
              border: "1px solid #ccc",
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              zIndex: 1000,
            }}
            onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
          >
            <ul className="p-1 m-0 list-none">
              <li
                className="px-4 py-1 hover:bg-red-100 cursor-pointer text-red-600"
                onClick={handleDeleteRows}
              >
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>

      {/* FORM SECTION */}
      <div className="w-full lg:w-1/3 card">
      <div className="card-header p-2  bg-blue-500">
        <h3 className="card-title p-2 font-bold text-white">Users Table</h3>
      </div>
        <div className="card-header p-2">
          <ul className="flex border-b border-gray-300">
            <li
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "primary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("primary")}
            >
              User Settings
            </li>
            <li
              className={`px-4 py-2 cursor-pointer ${
                !isUserSettingsFilled
                  ? "text-gray-400 cursor-not-allowed"
                  : activeTab === "secondary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => {
                if (isUserSettingsFilled) setActiveTab("secondary");
              }}
            >
              Privilege
            </li>
          </ul>
        </div>

        <div className="card-body p-3">
          {/* PRIMARY FORM */}
{activeTab === "primary" && (
  <form onSubmit={handleSubmitUserSettings}>

    {["user_id", "name", "department"].map((field) => (
      <div key={field} className="mb-4 relative">
        <input
          type="text"
          name={field}
          value={formInputs[field]}
          onChange={handleInputChange}
          placeholder=" "
          className="
            peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9
            focus:border-blue-500 focus:outline-none
          "
        />
        <label
          className="
            absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75
            bg-white px-1 text-gray-500 transition-all duration-200
            peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0
            peer-placeholder-shown:scale-100
            peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-500
          "
        >
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
      </div>
    ))}

    {/* ROLE SELECT WITH FLOATING LABEL */}
    <div className="mb-4 relative">
      <select
        name="role"
        value={formInputs.role}
        onChange={handleInputChange}
        className="peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-sm h-10 bg-white
                   focus:border-blue-500 focus:outline-none"
      >
        <option value="" hidden></option>
        {accessOptions.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <label
        className="
          absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 
          bg-white px-1 text-gray-500 transition-all duration-200
          peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0
          peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75
          peer-focus:text-blue-500
        "
      >
        Role
      </label>
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        className="h-7 border-2 rounded-md  btn-secondary w-full"
        onClick={handleSubmitUserSettings} // skip -> default Scheduler + isRead
      >
        Add User
      </button>
      <button
  type="button"
  disabled={!isUserSettingsFilled}
  className={`h-7 border-2 rounded-md w-full ${
    !isUserSettingsFilled
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "btn-primary"
  }`}
  onClick={() => {
    if (isUserSettingsFilled) setActiveTab("secondary");
  }}
>
  Give Privilege
</button>
    </div>
  </form>
)}

          {/* SECONDARY FORM */}
          {activeTab === "secondary" && (
            <div>
              <table className="table border">
                <thead>
                  <tr>
                    <th>CRUD \ Modules</th>
                    {modulesList.map((mod) => (
                      <th key={mod}>{mod}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {crudList.map((crud) => (
                    <tr key={crud}>
                      <td>{crud}</td>
                      {modulesList.map((mod) => (
                        <td key={mod} className="text-center">
                          <input
                            type="checkbox"
                            checked={formInputs.crudMatrix?.[crud]?.[mod] || false}
                            onChange={() => togglePrivilege(crud, mod)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="h-7 border-2 rounded-md btn-primary mt-3 w-full"
                onClick={handlePrivilegeSubmit}
              >
                Set Privilege and Add user
              </button>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default UserSetup;
