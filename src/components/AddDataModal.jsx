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

  const isFormValid = (() => {
    const currentType = formInputs.type || pendingRow?.type || ""; // ✅ normalize
  
    const isTypeCOM = currentType === "COM";
    const hasRateAgreement = !!formInputs.rateAgreementNo?.trim();
    const hasAgency = !!formInputs.agency?.trim();
  
    if (isTypeCOM) {
      return hasRateAgreement && hasAgency;
    }
    return true;
  })();

  const frame = pendingRow?.timePeriod?.frame ?? 0;

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
  value={formInputs.date}
  onChange={(e) => setFormInputs({ ...formInputs, date: e.target.value })}
  readOnly
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
                  checked={formInputs.repeat || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      repeat: e.target.checked,
                    })
                  }
                />
                <label className="ml-1 mb-0 text-xs">Repeat</label>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2 mt-1">
              <div className="form-group" style={{ flex: "0 0 30%" }}>
  <label className="text-xs">Type</label>
  <input
    type="text"
    className="form-control form-control-sm text-xs"
    value={formInputs.type || pendingRow?.type || ""} // prefill from pendingRow.type
    onChange={(e) =>
      setFormInputs({
        ...formInputs,
        type: e.target.value,
      })
    }
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
                  checked={formInputs.com || false}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      com: e.target.checked,
                    })
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
                    setFormInputs({
                      ...formInputs,
                      rateAgreementNo: e.target.value,       // ✅ use correct key
                    })
                  }
                />
                <p className="text-gray-500 text-xs">Mandatory for COM</p>
              </div>
              <div className="form-group" style={{ flex: "0 0 25%" }}>
                <label className="text-xs">Agency</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-xs"
                  value={formInputs.agency || ""}           // ✅ instead of category
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      agency: e.target.value,               // ✅
                    })
                  }
                />
                 <p className="text-gray-500 text-xs">Mandatory for COM</p>
              </div>
              <div className="form-group" style={{ flex: "0 0 50%" }}>
                <label className="text-xs">Project Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm w-full text-xs"
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

            {/* Time Period */}
{/* Time Period */}
<h6 className="font-bold text-xs mt-2">Time Period </h6>
<div className="flex flex-row flex-wrap gap-2">
  {["hour", "minute", "second", "frame"].map((type, idx) => (
    <div key={idx} className="form-group" style={{ flex: "0 0 22%" }}>
      <input
        type="text"
        className="form-control form-control-sm text-xs"
        value={
          idx < 3
            ? pendingRow?.prevEndTime
              ? pendingRow.prevEndTime.split(" ")[1].split(":")[idx] // HH, MM, SS
              : "00"
            : pendingRow?.prevFrameRate || "0" // frame from previous row
        }
        readOnly
      />
    </div>
  ))}
</div>



{/* Duration */}
<h6 className="font-bold text-xs mt-2">Duration</h6>
<div className="flex flex-row flex-wrap gap-2">
  {(() => {
    const durationParts = pendingRow?.duration?.split(":") || ["", "", ""];
    const frameRate = pendingRow?.frameRate?.replace(/\D/g, "") || "";

    return ["hour", "minute", "second", "frame"].map((type, idx) => (
      <div key={idx} className="form-group" style={{ flex: "0 0 22%" }}>
        <input
          type="text"
          className="form-control form-control-sm text-xs"
          maxLength={2}
          placeholder="00"
          defaultValue={
            idx === 3 
              ? frameRate // frame
              : durationParts[idx] // hour, minute, second
          }
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if ((type === "minute" || type === "second") && parseInt(value) > 59) {
              value = "59";
            }
            e.target.value = value;
          }}
           readOnly
        />
      </div>
    ));
  })()}
</div>



            <div className="flex flex-row flex-wrap gap-2 mt-1">
            <div className="form-group" style={{ flex: "0 0 25%" }}>
  <label className="text-xs">End Time (HH:MM:SS:FF)</label>
  <input
    type="text"
    className="form-control form-control-sm text-xs"
    placeholder="00:00:00:00"
    maxLength={11}
    value={
      pendingRow
        ? (() => {
            const startTime = pendingRow.prevEndTime
              ? new Date(pendingRow.prevEndTime)
              : new Date(0);

            const durationParts = pendingRow.duration?.split(":") || ["0","0","0"];
            const hours = parseInt(durationParts[0] || "0");
            const minutes = parseInt(durationParts[1] || "0");
            const seconds = parseInt(durationParts[2] || "0");

            const newEnd = new Date(startTime);
            newEnd.setHours(newEnd.getHours() + hours);
            newEnd.setMinutes(newEnd.getMinutes() + minutes);
            newEnd.setSeconds(newEnd.getSeconds() + seconds);

            // Calculate frame as previous frame + current row frame
            const prevFrame = parseInt(pendingRow.prevFrameRate || "0");
            const currFrame = parseInt(pendingRow.frameRate || "0");
            let totalFrame = prevFrame + currFrame;

            // Normalize frame if exceeds 24 (25fps)
            const extraSeconds = Math.floor(totalFrame / 25);
            totalFrame = totalFrame % 25;
            newEnd.setSeconds(newEnd.getSeconds() + extraSeconds);

            const hh = String(newEnd.getHours()).padStart(2, "0");
            const mm = String(newEnd.getMinutes()).padStart(2, "0");
            const ss = String(newEnd.getSeconds()).padStart(2, "0");
            const ff = String(totalFrame).padStart(2, "0");

            return `${hh}:${mm}:${ss}:${ff}`;
          })()
        : ""
    }
    readOnly
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
            <button
  className="btn btn-primary btn-sm"
  onClick={onConfirm}
  disabled={!isFormValid}
>
  Add
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDataModal;
