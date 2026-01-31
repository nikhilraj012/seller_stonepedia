const EditCompanyModal = ({
  open,
  onClose,
  editForm,
  setEditForm,
  onSubmit,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0  bg-black/20 z-30 flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[90vh] "
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
          Edit Company Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">
          Update your business information carefully
        </p>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label
              htmlFor="shopName"
              className="block text-xs md:text-sm font-medium text-black mb-1"
            >
              Shop Name
            </label>
            <input
              id="shopName"
              type="text"
              required
              placeholder="Enter shop name"
              value={editForm.shopName}
              onChange={(e) =>
                setEditForm({ ...editForm, shopName: e.target.value })
              }
              className=" w-full rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none  "
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs md:text-sm font-medium text-black mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter email address"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className=" w-full rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none  "
            />
          </div>

          <div>
            <label
              htmlFor="gstNumber"
              className="block text-xs md:text-sm font-medium text-black mb-1"
            >
              GST Number
            </label>
            <input
              id="gstNumber"
              type="text"
              required
              maxLength={15}
              pattern=".{15}"
              placeholder="22AAAAA0000A1Z5"
              value={editForm.gstNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, gstNumber: e.target.value })
              }
              onInput={(e) => e.target.setCustomValidity("")}
              className=" w-full rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none  "
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="  cursor-pointer text-xs md:text-sm px-4 py-2 rounded-lg border  text-gray-600 hover:bg-gray-100 transition  "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="cursor-pointer  text-xs md:text-sm px-4 py-2 rounded-lg  bg-primary text-white  hover:bg-[#6d1546] transition shadow-md   "
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyModal;
