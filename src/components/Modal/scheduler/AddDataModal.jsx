import React from "react";
import  { useEffect , useState } from "react";

const AddDataModal = ({
  show,
  onClose,
  onConfirm,
  formInputs,
  setFormInputs,
  pendingRow
}) => {

  const [localDuration, setLocalDuration] = useState("00:00:00:00");

// keep duration in sync when modal opens / formInputs updates
useEffect(() => {
  if (!show) return;

  const defaultDuration =
    formInputs.duration ||
    pendingRow?.duration ||
    "00:00:00:00";

  setLocalDuration(defaultDuration);

  // also ensure formInputs has it
  setFormInputs((prev) => ({
    ...prev,
    duration: defaultDuration,
  }));
}, [show, pendingRow, formInputs.duration, setFormInputs]);

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

  useEffect(() => {
    // Auto-select "Just Before" when:
    // 1) Type is COM
    // 2) Previous row type is NOT PGM
    if (
      pendingRow?.type === "COM" &&
      pendingRow?.prevRowType !== "PGM"
    ) {
      setFormInputs((prev) => ({
        ...prev,
        selectSpot: "Just Before",
      }));
    }
  }, [pendingRow, setFormInputs]);

  if (!show) return null; // Don't render if not visible
  console.log("PENDING ROW from modal", pendingRow)
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

  const needsJustBefore =
  pendingRow?.type === "COM" &&
  pendingRow?.prevRowType !== "PGM";

  
  

const isSelectSpotValid =
  !needsJustBefore || formInputs.selectSpot === "Just Before";

  const frame = pendingRow?.timePeriod?.frame ?? 0;
  //console.log("formInputs",formInputs)
  //console.log("pending row", pendingRow)
  // ---- Compute Final End Time + Correct Date ----
let finalEndTime = "00:00:00:00";
let finalEndDate = pendingRow?.prevEndTime?.split(" ")[0] || ""; // e.g. "2025-10-17"

console.log("prevEndTimefrommodal", pendingRow.prevEndTime)
console.log("finalEndDate", finalEndDate)
if (pendingRow) {
  const FPS = 25;
  const [prevDateStr, prevTimeStr] = (pendingRow.prevEndTime || "1970-01-01 00:00:00").split(" ");
  const [prevHH, prevMM, prevSS] = prevTimeStr.split(":").map(v => parseInt(v, 10) || 0);

  const prevFF =
    pendingRow.prevTimePeriod?.frameRate ??
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

console.log("formInputs", formInputs)

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
    ? `(Insert After: ${pendingRow.__insertAfterName}, index: ${pendingRow.__insertIndex})`
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
                  value={formInputs.slug}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      slug: e.target.value,
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
                <select
                    className="form-control form-control-sm text-xs"
                    value={formInputs.selectOption || ""}    // store into formInputs.selectOption
                    onChange={(e) =>
                      setFormInputs({
                        ...formInputs,
                        selectOption: e.target.value,
                      })
                    }
                  >
                    <option value="">--Select--</option>
                    <option value="a">a</option>
                    <option value="b">b</option>
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
                <label className="text-xs">File Name</label>
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
<h6 className="font-bold text-xs mt-2">Time Period (Start Time) </h6>
<div className="flex flex-row flex-wrap gap-2">
  {["hour", "minute", "second", "frameRate"].map((type, idx) => (
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
                if (pendingRow?.prevTimePeriod && typeof pendingRow.prevTimePeriod.frameRate === "number") {
                  return String(pendingRow.prevTimePeriod.frameRate).padStart(2, "0");
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
              if (idx === 0) newVal = Math.min(num, 23).toString();        // HH
              else if (idx === 1 || idx === 2) newVal = Math.min(num, 59).toString(); // MM SS
              else if (idx === 3) newVal = Math.min(num, 24).toString();  // FF
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
                {needsJustBefore && !isSelectSpotValid && (
                  <p className="text-red-500 text-xs mt-1">
                    Select Spot must be <b>Just Before</b> for COM when previous type is not PGM
                  </p>
                )}
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
  disabled={!isFormValid || !isSelectSpotValid}
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