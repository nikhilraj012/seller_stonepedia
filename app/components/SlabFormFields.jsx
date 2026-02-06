"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Select from "react-select";
import { selectCommonStyles, selectCommonTheme } from "./styles/select.config";
import { processFiles } from "../utils/fileUtils";

const SlabFormFields = ({ product, setProduct, hideMedia = false }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [customThickness, setCustomThickness] = useState("");
  const refs = useRef({});

  useEffect(() => {
    const onPointer = (e) => {
      if (!openDropdown) return;
      const wrap = wrapperMap[openDropdown]?.();
      if (wrap && wrap.contains(e.target)) return;
      setOpenDropdown(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpenDropdown(null);
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    const addedFiles = processFiles(files, product.media || []);
    if (addedFiles.length) {
      setProduct((prev) => ({
        ...prev,
        media: [...(prev.media || []), ...addedFiles],
      }));
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const bindRef = (name) => (el) => {
    refs.current[name] = el;
  };

  const wrapperMap = {
    finish: () => refs.current.finishWrapper,
    thickness: () => refs.current.thicknessWrapper,
    height: () => refs.current.heightWrapper,
    width: () => refs.current.widthWrapper,
  };

  const toggleOption = (type, value) => {
    setProduct((prev) => {
      const list =
        type === "finish"
          ? prev.finish || []
          : type === "thickness"
            ? prev.thickness || []
            : type === "height"
              ? prev.size.height || []
              : prev.size.width || [];

      const updatedList = list.includes(value)
        ? list.filter((i) => i !== value)
        : [...list, value];

      if (type === "height" || type === "width") {
        return { ...prev, size: { ...prev.size, [type]: updatedList } };
      }
      return { ...prev, [type]: updatedList };
    });
  };

  const addCustomThickness = () => {
    if (!customThickness) return;
    const newThickness = `${customThickness}MM`;
    if (!product.thickness.includes(newThickness)) {
      setProduct((prev) => ({
        ...prev,
        thickness: [...prev.thickness, newThickness],
      }));
    }
    setCustomThickness("");
  };

  return (
    <>
      <div className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
          <div className="w-full flex flex-col">
            <label
              htmlFor="stoneCategory"
              className="mb-0.5 text-xs font-medium"
            >
              Stone Category
            </label>
            <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
              <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                <input
                  id="stoneCategory"
                  type="text"
                  ref={bindRef("stoneCategory")}
                  placeholder="Travertine"
                  value={product.stoneCategory}
                  onChange={handleProductChange}
                  className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                  name="stoneCategory"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="stoneName" className="mb-0.5 text-xs font-medium">
              Stone Name
            </label>
            <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
              <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                <input
                  id="stoneName"
                  type="text"
                  placeholder="Stonepedia White Marble"
                  value={product.stoneName}
                  onChange={handleProductChange}
                  className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                  name="stoneName"
                />
              </div>
            </div>
          </div>
        </div>
        <div ref={bindRef("finishWrapper")} className="relative">
          <label className="text-xs font-medium mb-0.5 block">
            Add Stone Finishes
          </label>
          <div className="rounded-lg p-px transition bg-transparent outline-none ">
            <div
              ref={bindRef("finish")}
              tabIndex={0}
              className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition "
              onClick={() =>
                setOpenDropdown(openDropdown === "finish" ? null : "finish")
              }
            >
              <span
                className={`truncate ${
                  product.finish.length > 0 ? "text-black" : "text-gray-400"
                }`}
              >
                {product.finish.length === 0 ? "Select Finish" : "Finish"}
              </span>
              {openDropdown === "finish" ? (
                <IoIosArrowUp className="text-gray-500" />
              ) : (
                <IoIosArrowDown className="text-gray-500" />
              )}
            </div>
          </div>
          {openDropdown === "finish" && (
            <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow  z-10">
              {[
                "Polish",
                "Mirror Polished",
                "Flamed",
                "Honed",
                "Lapato",
                "Leather",
                "River Polished",
                "Sand Blast",
                "Shot Blast",
              ].map((opt) => (
                <label
                  htmlFor={`finish-${opt}`}
                  key={opt}
                  className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    id={`finish-${opt}`}
                    name="finish"
                    type="checkbox"
                    checked={product.finish.includes(opt)}
                    onChange={() => toggleOption("finish", opt)}
                    className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>

        {product.finish.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.finish.map((item) => (
              <div
                key={item}
                className="relative group px-3 md:px-4 py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
              >
                {item}

                <button
                  onClick={() => toggleOption("finish", item)}
                  className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                >
                  <RxCross2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div ref={bindRef("thicknessWrapper")} className="relative">
          <label
            htmlFor="thickness"
            className="text-xs font-medium mb-0.5 block"
          >
            Add Stone Thickness
          </label>
          <div className="rounded-lg p-px transition bg-transparent outline-none">
            <div
              ref={bindRef("thickness")}
              tabIndex={0}
              className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3  text-xs cursor-pointer transition"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "thickness" ? null : "thickness",
                )
              }
            >
              <span
                className={`truncate ${
                  product.thickness.length > 0 ? "text-black" : "text-gray-400"
                }`}
              >
                {product.thickness.length === 0
                  ? "Select Thickness"
                  : "Thickness"}
              </span>
              {openDropdown === "thickness" ? (
                <IoIosArrowUp className="text-gray-500" />
              ) : (
                <IoIosArrowDown className="text-gray-500" />
              )}
            </div>
          </div>

          {openDropdown === "thickness" && (
            <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow max-h-60 overflow-y-auto z-10">
              {["14MM", "16MM", "18MM", "20MM", "25MM"].map((opt) => (
                <label
                  htmlFor={`thickness-${opt}`}
                  key={opt}
                  className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`thickness-${opt}`}
                    name="thickness"
                    checked={product.thickness.includes(opt)}
                    onChange={() => toggleOption("thickness", opt)}
                    className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                  />
                  {opt}
                </label>
              ))}

              <div className="p-2 border-t border-gray-200">
                <div className="text-sm font-medium mb-1">Custom Size</div>

                <div className="flex items-center  gap-2 w-full">
                  <input
                    id="custom-thickness"
                    min={1}
                    type="text"
                    inputMode="numeric"
                    value={customThickness}
                    onChange={(e) => setCustomThickness(e.target.value)}
                    placeholder="Considered in MM"
                    className="flex-1  h-8 min-w-0 w-full not-even: px-2 py-1 text-[11px] border border-gray-300 rounded-md outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => addCustomThickness()}
                    disabled={!customThickness.trim()}
                    className={`shrink-0 px-4 h-8 text-[11px] rounded-md text-white
                        ${
                          !customThickness.trim()
                            ? "bg-primary/70 cursor-not-allowed"
                            : "bg-primary"
                        }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {product.thickness.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.thickness.map((item) => (
                <div
                  key={item}
                  className="relative group px-3 md:px-4 py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                >
                  {item}
                  <button
                    onClick={() => toggleOption("thickness", item)}
                    className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                  >
                    <RxCross2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-1">
            <label htmlFor="units" className="mb-0.5 font-medium text-xs">
              Units
            </label>
            <div className="cols-span-1 gap-3">
              <Select
                // ref={unitsRef}
                ref={bindRef("units")}
                options={[
                  { label: "SQM", value: "sqm" },
                  { label: "SQFT", value: "sqft" },
                ]}
                value={product.units}
                onChange={(label) => {
                  setProduct((prev) => ({
                    ...prev,
                    units: label,
                    size: {
                      height: [],
                      width: [],
                    },
                    value: "",
                  }));
                }}
                onMenuOpen={() => setOpenDropdown(null)}
                placeholder="Units"
                name="units"
                id="units"
                className="text-xs"
                styles={selectCommonStyles}
                theme={selectCommonTheme}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-0.5 font-medium text-xs">
              Size of Stone (W × H)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div ref={bindRef("heightWrapper")} className="relative">
                <div className="rounded-lg p-px transition bg-transparent outline-none">
                  <div
                    ref={bindRef("height")}
                    tabIndex={0}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-2.5 text-xs cursor-pointer transition"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "height" ? null : "height",
                      )
                    }
                  >
                    <span
                      className={`truncate ${
                        product.size.height.length > 0
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {product.size.height.length === 0
                        ? "Select Height"
                        : "Height"}
                    </span>
                    {openDropdown === "height" ? (
                      <IoIosArrowUp className="text-gray-500" />
                    ) : (
                      <IoIosArrowDown className="text-gray-500" />
                    )}
                  </div>
                </div>
                {openDropdown === "height" && (
                  <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow max-h-40 overflow-y-auto z-10">
                    {(product.units?.value === "sqm"
                      ? ["2-3 m", "4-5 m"]
                      : ["2-3 ft", "4-5 ft"]
                    ).map((opt) => (
                      <label
                        htmlFor={`height-${opt}`}
                        key={opt}
                        className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          id={`height-${opt}`}
                          name="height"
                          type="checkbox"
                          checked={product.size.height.includes(opt)}
                          onChange={() => toggleOption("height", opt)}
                          className="bg-transparent outline-none border-none cursor-pointer accent-primary"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
                {product.size.height.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.size.height.map((item) => (
                      <div
                        key={item}
                        className="relative group  px-3   md:px-4 xl:px-6 py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                      >
                        {item}
                        <button
                          onClick={() => toggleOption("height", item)}
                          className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                        >
                          <RxCross2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div ref={bindRef("widthWrapper")} className="relative">
                <div className="rounded-lg p-px transition bg-transparent outline-none">
                  <div
                    ref={bindRef("width")}
                    tabIndex={0}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-2.5 text-xs cursor-pointer transition"
                    onClick={() =>
                      setOpenDropdown(openDropdown === "width" ? null : "width")
                    }
                  >
                    <span
                      className={`truncate ${
                        product.size.width.length > 0
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {product.size.width.length === 0
                        ? "Select Width"
                        : "Width"}
                    </span>
                    {openDropdown === "width" ? (
                      <IoIosArrowUp className="text-gray-500" />
                    ) : (
                      <IoIosArrowDown className="text-gray-500" />
                    )}
                  </div>
                </div>

                {openDropdown === "width" && (
                  <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow max-h-40 overflow-y-auto z-10">
                    {(product.units?.value === "sqm"
                      ? ["2-3 m", "4-5 m"]
                      : ["2-3 ft", "4-5 ft"]
                    ).map((opt) => (
                      <label
                        htmlFor={`width-${opt}`}
                        key={opt}
                        className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          id={`width-${opt}`}
                          name="width"
                          type="checkbox"
                          checked={product.size.width.includes(opt)}
                          onChange={() => toggleOption("width", opt)}
                          className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {product.size.width.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.size.width.map((item) => (
                      <div
                        key={item}
                        className="relative group px-3 md:px-4 xl:px-6  py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                      >
                        {item}
                        <button
                          onClick={() => toggleOption("width", item)}
                          className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                        >
                          <RxCross2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-full flex flex-col">
          <label htmlFor="value" className="mb-0.5 text-xs font-medium">
            Enter Available Quantity
          </label>
          <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
            <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
              <input
                id="value"
                min={1}
                type="text"
                inputMode="numeric"
                placeholder={
                  product.units ? "Enter value" : "Select units first"
                }
                value={product.value || ""}
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                name="value"
                disabled={!product.units}
                className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
              />
              {product.units && (
                <p className="text-xs pr-4">{product.units.label}</p>
              )}
            </div>
          </div>
        </div> */}
        <div className="">
          <label htmlFor="description" className="mb-0.5 text-xs font-medium ">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Write Your Description"
            rows={4}
            value={product.description}
            onChange={handleProductChange}
            className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
            name="description"
          ></textarea>
        </div>
        {!hideMedia && (
          <div className="w-full">
            <label htmlFor="media" className="mb-0.5 text-xs font-medium">
              Upload image/Video
            </label>
            <div className="border border-dashed  border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white transition min-h-[100px] flex flex-col justify-center items-center">
              <input
                id="media"
                type="file"
                className="absolute inset-0 opacity-0"
               accept="image/jpeg,image/jpg,image/png,video/mp4"
                name="media"
                multiple
                onChange={handleFile}
              />
              <FiUpload size={20} className="mb-2 text-gray-900" />
              <p className="text-[#2C2C2C] text-[10px] md:text-xs font-medium tracking-wide pointer-events-none mb-1">
                Choose a Image/Video
              </p>
              <span className="text-[8px] product mb-2 text-gray-500 tracking-wide leading-relaxed pointer-events-none">
                Image up to 2MB,Video up to 5MB
              </span>
              <div className="h-6">
                {product.media?.length > 0 ? (
                  <p className="text-[#2C2C2C] text-[10px] font-medium">{`Uploaded ${product.media.length}`}</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => document.getElementById("media").click()} // <-- media here
                    className="border font-medium text-sm px-6 py-1 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition-colors pointer-events-auto relative z-10"
                  >
                    Browse
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SlabFormFields;
