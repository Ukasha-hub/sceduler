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
 // console.log("PENDING ROW",pendingRow.prevEndTime)
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

  // ---- Compute Final End Time + Correct Date ----
let finalEndTime = "00:00:00:00";
let finalEndDate = pendingRow?.prevEndTime?.split(" ")[0] || ""; // e.g. "2025-10-17"

if (pendingRow) {
  const FPS = 25;
  const [prevDateStr, prevTimeStr] = (pendingRow.prevEndTime || "1970-01-01 00:00:00").split(" ");
  const [prevHH, prevMM, prevSS] = prevTimeStr.split(":").map(v => parseInt(v, 10) || 0);

  const prevFF =
    pendingRow.prevTimePeriod?.frame ??
    (typeof pendingRow.prevFrameRate === "number" ? pendingRow.prevFrameRate % FPS : 0);

  const [durH, durM, durS, durF] = (pendingRow.duration || "00:00:00:00").split(":").map(v => parseInt(v, 10) || 0);

  let totalFrames = ((prevHH * 3600 + prevMM * 60 + prevSS) * FPS + prevFF) +
                    ((durH * 3600 + durM * 60 + durS) * FPS + durF);

  const finalHours = Math.floor(totalFrames / (FPS * 3600));
  totalFrames %= FPS * 3600;

  const finalMinutes = Math.floor(totalFrames / (FPS * 60));
  totalFrames %= FPS * 60;

  const finalSeconds = Math.floor(totalFrames / FPS);
  const finalFrames = totalFrames % FPS;

  // ⏰ Handle date rollover
  const dayOffset = Math.floor(finalHours / 24);
  const displayHours = finalHours % 24;

  const prevDate = new Date(prevDateStr);
  prevDate.setDate(prevDate.getDate() + dayOffset);
  finalEndDate = prevDate.toISOString().split("T")[0];

  finalEndTime =
    `${String(displayHours).padStart(2, "0")}:` +
    `${String(finalMinutes).padStart(2, "0")}:` +
    `${String(finalSeconds).padStart(2, "0")}:` +
    `${String(finalFrames).padStart(2, "0")}`;
}


  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="modal-dialog" style={{ maxWidth: "40%" }}>
        <div className="modal-content text-xs" style={{ fontSize: "0.75rem" }}>
          <div className="modal-header bg-blue-400 p-2">
          <h5 className="modal-title text-white text-lg">
  Add New Data{" "}
  {pendingRow?.__insertAfterName
    ? `(Insert After: ${pendingRow.__insertAfterName})`
    : `(Append at End)`
  }
</h5>

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
          // For H/M/S: show parts of previous end time when available, otherwise 00
          idx < 3
            ? (pendingRow?.prevEndTime
                ? pendingRow.prevEndTime.split(" ")[1].split(":")[idx]
                : "00")
            // For frame: derive previous frame component robustly
            : (() => {
                const FPS = 25;
                // If a structured prevTimePeriod exists, prefer its frame
                if (pendingRow?.prevTimePeriod && typeof pendingRow.prevTimePeriod.frame === "number") {
                  return String(pendingRow.prevTimePeriod.frame).padStart(2, "0");
                }
                // If prevFrameRate already stored as numeric frame component
                if (typeof pendingRow?.prevFrameRate === "number") {
                  return String(pendingRow.prevFrameRate % FPS).padStart(2, "0");
                }
                // Fallback: extract digits from a string and use last two digits
                const raw = String(pendingRow?.prevFrameRate ?? "").replace(/\D/g, "");
                if (raw.length === 0) return "00";
                const lastTwo = raw.slice(-2);
                const parsed = parseInt(lastTwo, 10) || 0;
                return String(parsed % FPS).padStart(2, "0");
              })()
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
    // Split into hour, minute, second, frame
    const [h = "00", m = "00", s = "00", f = "00"] = (pendingRow?.duration || "00:00:00:00").split(":");

    return [h, m, s, f].map((val, idx) => (
      <div key={idx} className="form-group" style={{ flex: "0 0 22%" }}>
        <input
          type="text"
          className="form-control form-control-sm text-xs"
          maxLength={2}
          placeholder="00"
          value={val}          // ✅ Controlled and correct
          readOnly            // ✅ As you want it display-only
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
    value={` ${finalEndTime}`}
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