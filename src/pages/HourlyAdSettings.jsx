import React from 'react'

const HourlyAdSettings = () => {
  return (
    <div className="flex justify-center  text-xs bg-gray-100 mt-3">
      <div className="card card-primary w-full lg:w-1/3">
        <div className="card-header">
          <h3 className="card-title text-white">Hourly Ad Settings</h3>
        </div>

        <form>
          <div className="card-body">
            {/* Type Field */}
            <div className="form-group mb-2">
              <label className="pr-2">Slot</label>
              <input
                type="text"
                className="border rounded px-1 py-0.5 h-7 w-75"
                id="type"
                placeholder="Enter Type"
              />
            </div>
          </div>

          <div className="card-footer flex flex-row justify-between gap-3">
            <button
              type="button"
              className="btn btn-primary btn-xs  w-10 h-10 flex-1 pb-2"
            >
              Save
            </button>
           
          </div>
        </form>
      </div>
    </div>
  )
}

export default HourlyAdSettings
