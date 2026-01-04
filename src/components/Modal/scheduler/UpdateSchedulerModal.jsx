import React from "react";
import  { useEffect, useState } from "react";

const UpdateSchedulerModal = ({
  show,
  formInputs,
  setFormInputs,
  selectedRow,
  onClose,
  onConfirm,
}) => {

  const [localDuration, setLocalDuration] = useState("00:00:00:00");

  useEffect(() => {
    if (!show) return;
  
    const defaultDuration =
      formInputs.duration || selectedRow?.duration || "00:00:00:00";
  
    setLocalDuration(defaultDuration);
  
    setFormInputs(prev => ({
      ...prev,
      duration: defaultDuration,
    }));
  }, [show, selectedRow, setFormInputs]);

  useEffect(() => {
    const ra = parseInt(formInputs.rateAgreementNo, 10);
  
    if (Number.isNaN(ra)) {
      // Clear agency if rate agreement is invalid or empty
      setFormInputs(prev => ({
        ...prev,
        agency: "",
      }));
      return;
    }
  
    let agency = "";
  
    if (ra >= 1 && ra <= 999) {
      agency = "Agency Alpha";
    } else if (ra >= 1000 && ra <= 1999) {
      agency = "Agency Beta";
    } else if (ra >= 2000 && ra <= 2999) {
      agency = "Agency Gamma";
    } else if (ra >= 3000) {
      agency = "Agency Delta";
    }
  
    setFormInputs(prev => ({
      ...prev,
      agency,
    }));
  }, [formInputs.rateAgreementNo, setFormInputs]);

  const startTime = selectedRow.startTime || "";
  const dateFromStartTime = startTime ? startTime.split(" ")[0] : "";

 
  if (!show) return null;
  console.log("update row", selectedRow)

 
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
                  value={dateFromStartTime|| ""}
             readOnly
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Slug</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.slug || ""}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, slug: e.target.value })
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
                  checked={formInputs.repeat || false}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, repeat: e.target.checked })
                  }
                 
                />
                <label className="ml-1 mb-0 text-xs">Repeat</label>
              </div>
            </div>

            {/* Type + isCommercial */}
            <div className="flex flex-row flex-wrap gap-2 mt-1">
            <div className="form-group" style={{ flex: "0 0 30%" }}>
  <label className="text-xs">Type</label>
  <input
    type="text"
    className="form-control form-control-sm text-xs"
    value={formInputs.type || ""} // prefill from pendingRow.type
   
    readOnly
  />
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
                    setFormInputs({ ...formInputs, isCommercial: e.target.checked })
                  }
                />
                <label className="ml-1 mb-0 text-xs">is Commercial</label>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
                <label className="text-xs">Select</label>
                <select className="form-control form-control-sm text-xs">
                  <option>a</option>
                  <option>b</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Rate Agreement No.</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.rateAgreementNo || ""}   // ✅ instead of category
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, rateAgreementNo: e.target.value })
                  }
               
                />
                <p className="text-gray-500 text-xs">Mandatory for COM</p>
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Agency</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.agency || ""}    
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, agency: e.target.value })
                  }       // ✅ instead of category
                  
                />
                 <p className="text-gray-500 text-xs">Mandatory for COM</p>
              </div>
              <div className="form-group" style={{ flex: "0 0 50%" }}>
                <label className="text-xs">Project Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm w-full text-xs"
                  value={selectedRow.name  || ""}
                  readOnly
                />
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Asset Id</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                 value={selectedRow.id  || ""}
                  readOnly
                />
              </div>
            </div>

           {/* Time Period */}
<h6 className="font-bold text-xs mt-2">Time Period </h6>
<div className="flex flex-row flex-wrap gap-2">
{["hour", "minute", "second", "frameRate"].map((type, idx) => (
  <div key={idx} className="form-group" style={{ flex: "0 0 22%" }}>
    <input
      type="text"
      className="form-control form-control-sm text-xs"
      value={String(formInputs.timePeriod?.[type] ?? "").padStart(2, "0")}
      readOnly
    />
  </div>
))}
</div>

{/* Duration */}
<h6 className="font-bold text-xs mt-2">Duration</h6>
<div className="flex flex-row flex-wrap gap-2">
  {["hour", "minute", "second", "frame"].map((_, idx) => {
    const durationParts = (localDuration || "::::").split(":");
    let val = durationParts[idx] || "";

    return (
      <div key={idx} className="form-group" style={{ flex: "0 0 22%" }}>
        <input
          type="text"
          className="form-control form-control-sm text-xs"
          maxLength={2}
          placeholder="00"
          value={val}
          onChange={(e) => {
            let newVal = e.target.value.replace(/\D/g, "");

            if (newVal !== "") {
              const num = parseInt(newVal, 10);
              if (idx === 0) newVal = Math.min(num, 23).toString();
              else if (idx === 1 || idx === 2) newVal = Math.min(num, 59).toString();
              else if (idx === 3) newVal = Math.min(num, 24).toString();
            }

            const updated = [...durationParts];
            updated[idx] = newVal;

            const newDuration = updated.join(":");
            setLocalDuration(newDuration);
            setFormInputs({
              ...formInputs,
              duration: newDuration,
            });
          }}
          onFocus={(e) => e.target.select()}
          onBlur={() => {
            const updated = [...durationParts].map((p, i) => {
              let num = parseInt(p, 10) || 0;
              if (i === 0) num = Math.min(num, 23);
              else if (i === 1 || i === 2) num = Math.min(num, 59);
              else if (i === 3) num = Math.min(num, 24);
              return String(num).padStart(2, "0");
            });

            const newDuration = updated.join(":");
            setLocalDuration(newDuration);
            setFormInputs({
              ...formInputs,
              duration: newDuration,
            });
          }}
        />
      </div>
    );
  })}
</div>
           

            {/* End Date + Bonus */}
            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">End Time</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.timePeriod
                    ? `${String(formInputs.timePeriod.hour).padStart(2, "0")}:${String(
                        formInputs.timePeriod.minute
                      ).padStart(2, "0")}:${String(formInputs.timePeriod.second).padStart(
                        2,
                        "0"
                      )}:${String(formInputs.timePeriod.frameRate || 0).padStart(2, "0")}`
                    : ""}
                 
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
                    setFormInputs({ ...formInputs, bonus: e.target.checked })
                  }
                 
                  
                />
                <label className="ml-1 mb-0 text-xs">Bonus</label>
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Select Spot</label>
                <select
                  className="form-control form-control-sm text-xs"
                  value={formInputs.selectSpot || ""}   // controlled
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      selectSpot: e.target.value,       // saved into formInputs
                    })
                  }
                >
                <option value="">--Select--</option>
                  <option value="Just Before">Just Before</option>
                  <option value="Super">Super</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer p-2">
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={() => onConfirm(formInputs)}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSchedulerModal;
