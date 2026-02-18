"use client";
import React, { useEffect, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";

const UnitForm = ({ title, description, config, aboutLabel, imageLabel }) => {
  const {
    data,
    setData,
    exists,
    edit,
    setEdit,
    onSave,
    onImageUpload,
    onBrochureUpload,
  } = config;

  const aboutRef = useRef(null);

  useEffect(() => {
    if (edit && aboutRef.current) {
      aboutRef.current.focus();
    }
  }, [edit]);

  return (
    <form onSubmit={onSave}>
      <div className="bg-white border-[#D7D7D7] rounded-2xl shadow-md">
        {/* Header */}
        <div
          className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 
flex flex-col sm:flex-row 
gap-2 sm:gap-0  rounded-t-xl
justify-between sm:items-center"
        >
          <div>
            <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>

          {exists && !edit && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setEdit(true)}
                className="border cursor-pointer   w-fit px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <MdOutlineEdit />
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* ABOUT */}
          <div>
            <label className="mb-0.5 text-xs font-medium">{aboutLabel}</label>

            <textarea
              ref={aboutRef}
              required
              rows={4}
              disabled={exists && !edit}
              value={data?.about || ""}
              onChange={(e) => setData({ ...data, about: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
              placeholder="Write here"
            />
          </div>

          {/* BROCHURE */}
          <div>
            <label className="mb-0.5 text-xs font-medium">
              Upload Brochure <span className="text-[#BCBCBC]">(Optional)</span>
            </label>

            <div className="border border-dashed border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white transition min-h-[100px] flex flex-col justify-center items-center">
              <input
                type="file"
                accept="application/pdf"
                disabled={exists && !edit}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onBrochureUpload}
              />

              <p className="text-[#2C2C2C] text-xs font-medium tracking-wide mb-1">
                {data?.brochureName || "Choose a file"}
              </p>

              <span className="text-[10px] text-gray-500 mb-2">PDF Only</span>

              {!data?.brochureName && (
                <button
                  type="button"
                  disabled={exists && !edit}
                  className="border font-medium text-sm px-6 py-1 rounded-xl hover:border-primary hover:shadow-md transition-colors"
                >
                  Browse
                </button>
              )}
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-0.5 text-xs font-medium">{imageLabel}</label>

            <div className="flex items-center justify-between border border-gray-200 rounded-lg bg-white p-3 transition relative">
              <input
                type="file"
                accept="image/jpeg,image/png"
                disabled={exists && !edit}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onImageUpload}
              />

              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-700">
                  {data?.imageName || "No image selected"}
                </span>
              </div>
              {(edit || !exists) && (
                <button
                  type="button"
                  disabled={exists && !edit}
                  className="bg-gray-100 hover:shadow-lg text-gray-700 text-xs px-4 py-1.5 rounded-md hover:bg-gray-200 font-medium"
                >
                  Choose Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SAVE / CANCEL */}
      {(edit || !exists) && (
        <div className="flex justify-end gap-4 pt-2">
          {exists && (
            <button
              type="button"
              onClick={() => setEdit(false)}
              className="px-4 xl:px-6 cursor-pointer border-gray-400 text-xs font-medium md:text-sm  py-2 border rounded-lg"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-4 xl:px-6 py-2 cursor-pointer text-xs font-medium md:text-sm  bg-primary text-white rounded-lg"
          >
            {exists ? "Save Changes" : `Create ${title}`}
          </button>
        </div>
      )}
    </form>
  );
};

export default UnitForm;
