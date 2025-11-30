import React, { useState, useEffect } from "react";

const getInitialData = () => {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : [];
};

const UserSetup = () => {
  const [tableData, setTableData] = useState(getInitialData());
  const [activeTab, setActiveTab] = useState("primary");
  const [formInputs, setFormInputs] = useState({
    userId: "",
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
    localStorage.setItem("users", JSON.stringify(tableData));
  }, [tableData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormInputs({
      userId: "",
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

  const handleSubmitUserSettings = (e) => {
    e.preventDefault();
    if (!formInputs.userId || !formInputs.name || !formInputs.department) {
      alert("All fields are required!");
      return;
    }

    const newRow = {
      ...formInputs,
      modules: ["Scheduler"], // default if skip
      crud: { isRead: true, isWrite: false, isUpdate: false, isDelete: false },
      id: Date.now(),
    };

    setTableData((prev) => [...prev, newRow]);
    resetForm();
  };

  const handlePrivilegeSubmit = () => {
    const newRow = {
      ...formInputs,
      id: Date.now(),
    };

    setTableData((prev) => [...prev, newRow]);
    resetForm();
    setActiveTab("primary");
  };

  // PRIVILEGE TABLE HANDLER
  const togglePrivilege = (crud, module) => {
    setFormInputs((prev) => {
      const currentModules = prev.modules.includes(module)
        ? prev.modules
        : [...prev.modules, module]; // auto-add module if any permission set
      return {
        ...prev,
        modules: currentModules,
        crudMatrix: {
          ...prev.crudMatrix,
          [crud]: { ...prev.crud[crud], [module]: !prev.crudMatrix?.[crud]?.[module] },
        },
      };
    });
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

  const rect = e.currentTarget.closest(".card-body").getBoundingClientRect();

  setContextMenu({
    visible: true,
    x: e.clientX - rect.left, // relative to container
    y: e.clientY - rect.top,  // relative to container
  });
};

const handleDeleteRows = () => {
  setTableData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
  setSelectedRows([]);
  setContextMenu({ ...contextMenu, visible: false });
};

  return (
    <div className="flex gap-3 flex-col lg:flex-row mt-4 text-sm px-2">

      {/* TABLE SECTION */}
      <div className="w-full  lg:w-3/4 ">
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
              <th className="border-b p-2 text-left">CRUD</th>
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

                <td  className="border-t p-2">{row.userId}</td>
                <td  className="border-t p-2">{row.name}</td>
                <td  className="border-t p-2">{row.department}</td>
                <td  className="border-t p-2">{row.role}</td>
                <td  className="border-t p-2">{row.modules?.join(", ")}</td>
                <td  className="border-t p-2">
                  {Object.entries(row.crud || {}).map(([key, val]) =>
                    val ? `${key}: Yes ` : `${key}: No `
                  )}
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
      <div className="w-full lg:w-2/4 card">
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
                activeTab === "secondary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("secondary")}
            >
              Privilege
            </li>
          </ul>
        </div>

        <div className="card-body p-3">
          {/* PRIMARY FORM */}
{activeTab === "primary" && (
  <form onSubmit={handleSubmitUserSettings}>

    {["userId", "name", "department"].map((field) => (
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
        Skip
      </button>
      <button
        type="button"
        className="h-7 border-2 rounded-md  btn-primary w-full"
        onClick={() => setActiveTab("secondary")}
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
                Set Privilege
              </button>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default UserSetup;
