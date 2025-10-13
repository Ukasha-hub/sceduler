import React from "react";

const AddDataModal = ({
  show,
  onClose,
  onConfirm,
  formInputs,
  setFormInputs,
  pendingRow
}) => {
  if (!show) return null; // Don't render if not visible

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="modal-dialog" style={{ maxWidth: "40%" }}>
        <div className="modal-content text-xs" style={{ fontSize: "0.75rem" }}>
          <div className="modal-header bg-blue-400 p-2">
            <h5 className="modal-title text-white text-lg">Add New Data</h5>
            <button className="close text-white" onClick={onClose}>
              &times;
            </button>
          </div>

          <div
            className="modal-body px-4"
            style={{
              maxHeight: "75vh",
              overflowY: "auto",
              padding: "1rem",
            }}
          >
            <div className="flex flex-row flex-wrap gap-2">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm text-xs"
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Slug</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.category}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div
                className="form-group flex items-center ml-4 mb-0"
                style={{ flex: "0 0 30%" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formInputs.check || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      check: e.target.checked,
                    })
                  }
                />
                <label className="ml-1 mb-0 text-xs">Repeat</label>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Type</label>
                <select className="form-control form-control-sm text-xs">
                  <option>COM</option>
                  <option>PGM</option>
                  <option value="">PRO</option>
                </select>
              </div>
              <div
                className="form-group flex items-center ml-4 mb-0"
                style={{ flex: "0 0 30%" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formInputs.check || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      check: e.target.checked,
                    })
                  }
                />
                <label className="ml-1 mb-0 text-xs">is Commercial</label>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Type</label>
                <select className="form-control form-control-sm text-xs">
                  <option>COM</option>
                  <option>not COM</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Rate Agreement No.</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.category}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Agency</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.category}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Project Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={pendingRow?.name || ""}
                  readOnly
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Asset Id</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={pendingRow?.id || ""}
                  readOnly
                />
              </div>
            </div>

            <h6 className="font-bold text-xs mt-2">Time Period</h6>
            <div className="flex flex-row flex-wrap gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="form-group" style={{ flex: "0 0 22%" }}>
                  <select className="form-control form-control-sm text-xs">
                    <option>00</option>
                    <option>01</option>
                    <option>02</option>
                  </select>
                </div>
              ))}
            </div>

            <h6 className="font-bold text-xs mt-2">Duration</h6>
            <div className="flex flex-row flex-wrap gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="form-group" style={{ flex: "0 0 22%" }}>
                  <select className="form-control form-control-sm text-xs">
                    <option>COM</option>
                    <option>00</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">End Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm text-xs"
                />
              </div>
              <div
                className="form-group flex items-center ml-4 mb-0"
                style={{ flex: "0 0 25%" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formInputs.check || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      check: e.target.checked,
                    })
                  }
                />
                <label className="ml-1 mb-0 text-xs">Bonus</label>
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Select Spot</label>
                <select className="form-control form-control-sm text-xs">
                  <option>Just Before</option>
                  <option>Super</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer p-2">
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={onConfirm}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDataModal;
