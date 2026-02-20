import { LocationSelector } from "@/app/components/LocationSelector";
import { useEffect, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
const CompanyProfileForm = ({
  company,
  setCompany,
  companyExists,
  companyEdit,
  setCompanyEdit,
  onSave,
}) => {
  const companyNameRef = useRef(null);

  useEffect(() => {
    if (companyEdit && companyNameRef.current) companyNameRef.current.focus();
  }, [companyEdit]);

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
            <h2 className="font-semibold text-lg text-gray-800">
              Company Profile
            </h2>
            <p className="text-sm text-gray-500">Manage company details.</p>
          </div>

          {companyExists && !companyEdit && (
            <div className="flex justify-end">
              <button
                onClick={() => setCompanyEdit(true)}
                className="border cursor-pointer  w-fit px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2"
              >
                <MdOutlineEdit />
                Edit Company
              </button>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                <span className="text-red-500 text-[17px] mt-1">*</span> Company
                Name
              </label>
              <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                  <input
                    ref={companyNameRef}
                    type="text"
                    required
                    value={company?.companyName || ""}
                    disabled={companyExists && !companyEdit}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        companyName: e.target.value,
                      })
                    }
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
                <span className="text-red-500 text-[17px] mt-1">*</span>
                Company Pincode
              </label>
              <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{6}"
                    value={company?.pincode || ""}
                    disabled={companyExists && !companyEdit}
                    required
                    onChange={(e) =>
                      setCompany({ ...company, pincode: e.target.value })
                    }
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LocationSelector
              country={company?.country}
              state={company?.state}
              city={company?.city}
              disabled={companyExists && !companyEdit}
              onChange={(loc) =>
                setCompany((prev) => ({
                  ...prev,
                  ...loc,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-0.5 text-xs font-medium text-gray-600">
                GST / Government Id
              </label>
              <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                  <input
                    type="text"
                    value={company?.gstNumber || ""}
                    disabled={companyExists && !companyEdit}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        gstNumber: e.target.value,
                      })
                    }
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-0.5 text-xs font-medium text-gray-600">
                Website URL
              </label>
              <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
                <div className="flex items-center rounded-lg bg-white border border-[#D7D7D7] focus-within:border-transparent">
                  <input
                    type="url"
                    // placeholder="https://stonepedia.in/"
                    value={company?.websiteUrl || ""}
                    disabled={companyExists && !companyEdit}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        websiteUrl: e.target.value,
                      })
                    }
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full "
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-0.5 text-xs font-medium text-gray-600 flex items-center gap-1">
              <span className="text-red-500 text-[17px] mt-1">*</span>
              Address
            </label>
            <div className="rounded-lg p-[1px] transition bg-transparent focus-within:bg-gradient-to-t focus-within:from-[#d6c9ea] focus-within:to-[#871B58]">
              <div className="bg-white border border-[#D7D7D7] rounded-lg focus-within:border-transparent">
                <textarea
                  required
                  value={company?.address || ""}
                  disabled={companyExists && !companyEdit}
                  onChange={(e) =>
                    setCompany({ ...company, address: e.target.value })
                  }
                  className="w-full bg-transparent outline-none border-0 p-3 text-xs "
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {(companyEdit || !companyExists) && (
        <div className="flex justify-end gap-4 pt-4">
          {companyExists && (
            <button
              onClick={() => setCompanyEdit(false)}
              className="px-4 xl:px-6 cursor-pointer border-gray-400 text-xs font-medium md:text-sm  py-2 border rounded-lg"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-4 xl:px-6 py-2 cursor-pointer text-xs font-medium md:text-sm  bg-primary text-white rounded-lg"
          >
            {companyExists ? "Save Changes" : "Create Company"}
          </button>
        </div>
      )}
    </form>
  );
};

export default CompanyProfileForm;
