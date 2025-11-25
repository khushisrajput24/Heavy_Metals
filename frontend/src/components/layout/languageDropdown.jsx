import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { languages } from "../../utils/constants";

export const LanguageDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("English");

  const languageOptions = languages;

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label="Languages"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
      >
        <Languages size={20} />
        <span className="text-xs font-bold">{selected}</span>
        <ChevronDown
          size={14}
          className={`${open ? "rotate-180" : ""} transition-transform`}
        />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg p-1 z-50">
          {languageOptions.map((lang) => (
            <div
              key={lang}
              onClick={() => {
                setSelected(lang);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 ${
                selected === lang ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
