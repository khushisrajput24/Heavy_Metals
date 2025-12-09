import { useState } from "react";

export default function QuestionnaireForm() {
  const [form, setForm] = useState({
    location: "",
    latitude: "",
    longitude: "",
    metal: "",
    concentration: "",
    unit: "ppm",
    rootCause: "",
    effects: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", form);
  };

  return (
    <div className="flex justify-center p-6">
      <div>
        <div className="card-title">Field Sampling Questionnaire</div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Location + Metal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Location / Area</label>
              <input
                name="location"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Village / Zone / Sector"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-semibold">Metal Type</label>
              <input
                name="metal"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Pb, Cd, Cr, etc."
                value={form.metal}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Concentration + Unit + Latitude */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">Concentration</label>
              <input
                name="concentration"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="0.05"
                value={form.concentration}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-semibold">Unit</label>
              <select
                name="unit"
                value={form.unit}
                className="w-full mt-1 p-2 border rounded-lg"
                onChange={handleChange}
              >
                <option value="ppm">ppm</option>
                <option value="ppb">ppb</option>
                <option value="mg/L">mg/L</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">GPS Latitude</label>
              <input
                name="latitude"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Auto or Manual"
                value={form.latitude}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Longitude + Effects */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">GPS Longitude</label>
              <input
                name="longitude"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Auto or Manual"
                value={form.longitude}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-semibold">Observed Effects</label>
              <input
                name="effects"
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Health / Environmental"
                value={form.effects}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Root Cause */}
          <div>
            <label className="block font-semibold">Root Cause Analysis</label>
            <textarea
              name="rootCause"
              className="w-full mt-1 p-2 border rounded-lg"
              rows={3}
              placeholder="Industrial waste, agricultural runoff, corrosion, etc."
              value={form.rootCause}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-semibold">Additional Notes</label>
            <textarea
              name="notes"
              className="w-full mt-1 p-2 border rounded-lg"
              rows={3}
              placeholder="Any other field observations"
              value={form.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <button type="submit" className="btn calculate-btn">
              Submit Sample Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
