import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CustomDropdown = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Choose",
}) => {
  const [open, setOpen] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [otherSelected, setOtherSelected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);
  const selectValue = (opt) => {
    if (opt === "Other") {
      setOtherSelected(true);
      onChange({ target: { name, value: "Other" } });
      return;
    }

    setOtherSelected(false);
    setOtherValue("");
    onChange({ target: { name, value: opt } });
    setOpen(false);
  };

  const addOther = () => {
    if (!otherValue.trim()) return;

    onChange({
      target: { name, value: otherValue.trim() },
    });

    setOtherSelected(false);
    setOtherValue("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative mt-2">
      {label && (
        <label className="text-xs font-medium mb-0.5 block">{label}</label>
      )}

      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3 text-xs bg-white border border-gray-300 rounded-lg cursor-pointer"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        {open ? (
          <IoIosArrowUp className="text-gray-500" />
        ) : (
          <IoIosArrowDown className="text-gray-500" />
        )}
      </div>

      {open && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow z-10">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={() => selectValue(opt)}
                className="accent-[#871B58]"
              />
              {opt}
            </label>
          ))}

          {otherSelected && (
            <div className="p-2">
              <div className="flex items-center  gap-2 w-full">
                <input
                  type="text"
                  className="flex-1  h-8 min-w-0 w-full not-even: px-2 py-1 text-[11px] border border-gray-300 rounded-md outline-none"
                  placeholder="Enter value"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                />

                <button
                  onClick={addOther}
                  disabled={!otherValue.trim()}
                  className={`shrink-0 px-4 h-8 text-[11px] rounded-md text-white
                  ${
                    !otherValue.trim()
                      ? "bg-primary/70 cursor-not-allowed"
                      : "bg-[#871B58] cursor-pointer"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
