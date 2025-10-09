import React from "react";

const UpdateSchedulerModal = ({
  show,
  formInputs,
  setFormInputs,
  selectedRow,
  onClose,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="modal-dialog" style={{ maxWidth: "40%" }}>
        <div className="modal-content text-xs" style={{ fontSize: "0.75rem" }}>
          <div className="modal-header bg-green-500 p-2">
            <h5 className="modal-title text-white text-lg">Update Data</h5>
            <button className="close text-white" onClick={onClose}>
              &times;
            </button>
          </div>

          <div
            className="modal-body px-4"
            style={{ maxHeight: "75vh", overflowY: "auto", padding: "1rem" }}
          >
            {/* Date + Slug + Repeat */}
            <div className="flex flex-row flex-wrap gap-2">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.date || ""}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, date: e.target.value })
                  }
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Slug</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.category || ""}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, category: e.target.value })
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

            {/* Type + isCommercial */}
            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Type</label>
                <select
                  className="form-control form-control-sm text-xs"
                  value={formInputs.type || ""}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, type: e.target.value })
                  }
                >
                  <option value="COM">COM</option>
                  <option value="not COM">not COM</option>
                </select>
              </div>
              <div
                className="form-group flex items-center ml-4 mb-0"
                style={{ flex: "0 0 30%" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formInputs.isCommercial || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      isCommercial: e.target.checked,
                    })
                  }
                />
                <label className="ml-1 mb-0 text-xs">is Commercial</label>
              </div>
            </div>

            {/* Project Details */}
            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Project Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={selectedRow?.name || ""}
                  readOnly
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Asset Id</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={selectedRow?.id || ""}
                  readOnly
                />
              </div>
            </div>

            {/* End Date + Bonus */}
            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">End Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.endDate || ""}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, endDate: e.target.value })
                  }
                />
              </div>
              <div
                className="form-group flex items-center ml-4 mb-0"
                style={{ flex: "0 0 25%" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formInputs.bonus || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      bonus: e.target.checked,
                    })
                  }
                />
                <label className="ml-1 mb-0 text-xs">Bonus</label>
              </div>
            </div>
          </div>

          <div className="modal-footer p-2">
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={onConfirm}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSchedulerModal;
