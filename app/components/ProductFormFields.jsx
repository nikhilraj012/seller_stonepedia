"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Select from "react-select";

import { selectCommonStyles, selectCommonTheme } from "./styles/select.config";
import CustomDropdown from "./common/CustomDropdown";
import { processFiles } from "../utils/fileUtils";

const ProductFormFields = ({ product, setProduct, hideMedia = false }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <>
      <div className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
          <div className="w-full md:mt-1.5 flex flex-col">
            <label htmlFor="productName" className="mb-0.5 text-xs font-medium">
              Product Name
            </label>
            <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
              <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                <input
                  id="productName"
                  type="text"
                  placeholder="Enter here"
                  value={product.productName}
                  onChange={handleProductChange}
                  className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                  name="productName"
                />
              </div>
            </div>
          </div>

          <CustomDropdown
            label="Category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            options={[
              "Artefact",
              "Fixture / Stone furniture",
              "Wall panelling",
              "Temple / Accessories",
              "Idol’s",
              "Other",
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <label className="mb-0.5 font-medium text-xs">
              Size of Product (W × H)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="height"
                    type="text"
                    inputMode="numeric"
                    min={1}
                    placeholder="Enter height"
                    value={product.size.height}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        size: {
                          ...prev.size,
                          height: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    name="height"
                  />
                </div>
              </div>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="width"
                    type="text"
                    inputMode="numeric"
                    min={1}
                    placeholder="Enter width"
                    value={product.size.width}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        size: {
                          ...prev.size,
                          width: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    name="width"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-2 md:col-span-1">
            <div className="w-full flex flex-col">
              <label htmlFor="weight" className="mb-0.5 text-xs font-medium">
                Weight <span className="text-[#BCBCBC]">(kg)</span>
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="weight"
                    type="text"
                    inputMode="numeric"
                    min={1}
                    placeholder="Enter here"
                    value={product.weight}
                    onChange={handleProductChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    name="weight"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
          <div className="w-full flex flex-col">
            <label
              htmlFor="minimumOrder"
              className="mb-0.5 text-xs font-medium"
            >
              Minimum Order
            </label>
            <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
              <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                <input
                  id="minimumOrder"
                  min={1}
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter minimum quantity"
                  value={product.minimumOrder}
                  onChange={handleProductChange}
                  className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                  name="minimumOrder"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label
              htmlFor="pricePerProduct"
              className="mb-0.5 text-xs font-medium"
            >
              Price Per Product
            </label>
            <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
              <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                <div className="relative flex-1 group">
                  <input
                    id="pricePerProduct"
                    min={1}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter price per product"
                    value={product.pricePerProduct}
                    onChange={handleProductChange}
                    className={`flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full ${
                      !product.currency ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    name="pricePerProduct"
                    disabled={!product.currency} // <-- Disable if currency not selected
                  />

                  {!product.currency && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                      Please select currency first
                    </div>
                  )}
                </div>
                <Select
                  placeholder="Currency"
                  options={[
                    { value: "INR", label: "₹" },
                    { value: "USD", label: "$" },
                  ]}
                  value={
                    product.currency
                      ? {
                          value: product.currency,
                          label: product.currency,
                        }
                      : null
                  }
                  styles={selectCommonStyles}
                  theme={selectCommonTheme}
                  className="text-xs"
                  onChange={(option) =>
                    setProduct((prev) => ({
                      ...prev,
                      currency: option.label,
                      pricePerProduct: "",
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="w-full md:col-span-2">
            <label
              htmlFor="description"
              className="mb-0.5 text-xs font-medium "
            >
              Product Description
            </label>
            <textarea
              id="description"
              placeholder="Write Product Description"
              rows={4}
              value={product.description}
              onChange={handleProductChange}
              className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
              name="description"
            ></textarea>
          </div>

          {!hideMedia && (
            <div className="w-full md:col-span-2">
              <label htmlFor="media" className="mb-0.5 text-xs font-medium">
                Upload Image/Video
              </label>
              <div className="border border-dashed  border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white transition min-h-[100px] flex flex-col justify-center items-center">
                <input
                  id="media"
                  type="file"
                  className="absolute inset-0 opacity-0 "
                  accept="video/*,image/*"
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
      </div>
    </>
  );
};

export default ProductFormFields;
