import { selectCommonStyles, selectCommonTheme } from "@/app/components/styles/select.config";
import React from "react";
import { FiUpload } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Select from "react-select";



export default function SlabDetailsForm({
  product,
  toggleOption,
  setProduct,
  handleAddproduct,
  editCancel,
  selectedFinish = [],
  selectedThickness = [],
  selectedHeight = [],
  selectedWidth = [],
  setSelectedHeight,
  setSelectedWidth,
  customThickness = "",
  setCustomThickness,
  addCustomThickness,
  handleFile,
  editIndex = null,
  openDropdown,
  setOpenDropdown,
  // stoneCategoryRef,
  // finishWrapperRef,
  // finishRef,
  // thicknessWrapperRef,
  // thicknessRef,
  // unitsRef,
  // heightWrapperRef,
  // heightRef,
  // widthWrapperRef,
  // widthRef,
  refs,
  bindRef,
  finishOptions = [],
  thicknessOptions = [],
  heightOptions = [],
  widthOptions = [],
}) {
  
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    setProduct((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  return (
    <div className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
        <div className="w-full flex flex-col">
          <label htmlFor="stoneCategory" className="mb-0.5 text-xs font-medium">
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
                selectedFinish.length > 0 ? "text-black" : "text-gray-400"
              }`}
            >
              {selectedFinish.length === 0 ? "Select Finish" : "Finish"}
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
            {finishOptions.map((opt) => (
              <label
                htmlFor={`finish-${opt}`}
                key={opt}
                className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
              >
                <input
                  id={`finish-${opt}`}
                  name="finish"
                  type="checkbox"
                  checked={selectedFinish.includes(opt)}
                  onChange={() => toggleOption("finish", opt)}
                  className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedFinish.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedFinish.map((item) => (
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
        <label htmlFor="thickness" className="text-xs font-medium mb-0.5 block">
          Add Stone Thickness
        </label>
        <div className="rounded-lg p-px transition bg-transparent outline-none">
          <div
            ref={bindRef("thickness")}
            tabIndex={0}
            className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
            onClick={() =>
              setOpenDropdown(openDropdown === "thickness" ? null : "thickness")
            }
          >
            <span
              className={`truncate ${
                selectedThickness.length > 0 ? "text-black" : "text-gray-400"
              }`}
            >
              {selectedThickness.length === 0
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
            {thicknessOptions.map((opt) => (
              <label
                htmlFor={`thickness-${opt}`}
                key={opt}
                className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`thickness-${opt}`}
                  name="thickness"
                  checked={selectedThickness.includes(opt)}
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
        {selectedThickness.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedThickness.map((item) => (
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
                  height: null,
                  width: null,
                }));
                setSelectedHeight([]);
                setSelectedWidth([]);
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
                  className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "height" ? null : "height")
                  }
                >
                  <span
                    className={`truncate ${
                      selectedHeight.length > 0 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {selectedHeight.length === 0 ? "Select Height" : "Height"}
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
                  {heightOptions.map((opt) => (
                    <label
                      htmlFor={`height-${opt}`}
                      key={opt}
                      className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        id={`height-${opt}`}
                        name="height"
                        type="checkbox"
                        checked={selectedHeight.includes(opt)}
                        onChange={() => toggleOption("height", opt)}
                        className="bg-transparent outline-none border-none cursor-pointer accent-primary"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {selectedHeight.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedHeight.map((item) => (
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
                  className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "width" ? null : "width")
                  }
                >
                  <span
                    className={`truncate ${
                      selectedWidth.length > 0 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {selectedWidth.length === 0 ? "Select Width" : "Width"}
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
                  {widthOptions.map((opt) => (
                    <label
                      htmlFor={`width-${opt}`}
                      key={opt}
                      className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        id={`width-${opt}`}
                        name="width"
                        type="checkbox"
                        checked={selectedWidth.includes(opt)}
                        onChange={() => toggleOption("width", opt)}
                        className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {selectedWidth.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedWidth.map((item) => (
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
      <div className="w-full">
        <label htmlFor="media" className="mb-0.5 text-xs font-medium">
          Upload Block image/Video
        </label>
        <div className="border border-dashed  border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white hover:shadow-md transition min-h-[100px] flex flex-col justify-center items-center">
          <input
            id="media"
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="video/*,image/*"
            name="media"
            multiple
            onChange={handleFile}
          />
          <FiUpload size={20} className="mb-2 text-gray-900" />
          <p className="text-[#2C2C2C] text-[10px] md:text-xs font-medium tracking-wide pointer-events-none mb-1">
            Choose a Image/Video or drag & drop it here
          </p>
          <span className="text-[8px] product mb-2 text-gray-500 tracking-wide leading-relaxed pointer-events-none">
            JPEG, PNG and MP4 formats up to 20MB
          </span>
          <div className="h-6">
            {product.media?.length > 0 ? (
              <p className="text-[#2C2C2C] text-[10px] font-medium">{`Uploaded ${product.media.length}`}</p>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById("media").click()} // <-- media here
                className="inline-product bg-white border font-medium text-sm px-6 py-1 rounded-xl shadow-sm hover:bg-primary hover:text-white hover:shadow-md transition"
              >
                Browse
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {editIndex != null && (
          <button
            type="button"
            onClick={editCancel}
            disabled={editIndex === null}
            className="px-4 py-2 md:px-8 border border-gray-300 rounded-md text-gray-700 text-xs cursor-pointer hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleAddproduct}
          className="bg-primary hover:bg-[#6a1545] px-4 py-2 md:px-8 lg:px-10 xl:px-14 rounded-md text-white text-xs cursor-pointer"
        >
          {editIndex != null ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );
}
