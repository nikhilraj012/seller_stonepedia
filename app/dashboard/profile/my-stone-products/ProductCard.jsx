"use client";
import { IoLocation } from "react-icons/io5";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ProductCard = ({
  item,
  updating,

  addSlabRoute,
  actions,
}) => {
  const router = useRouter();
  const {
    updateThumbnail,
    handleProductFeedback,
    onEdit,
    onDelete,
    handleCancel,
    onProductDelete,
    onViewDetails,
  } = actions;

  const [imageLoading, setImageLoading] = useState(true);
  const [productImageLoading, setProductImageLoading] = useState({});
  const fileRef = useRef(null);
  const status = item.status;
  const canEdit = String(status).toLowerCase() === "pending";

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000) // Firestore Timestamp
      : new Date(timestamp); // normal timestamp

    return date.toLocaleDateString("en-US", {
      month: "long", // December
      day: "2-digit", // 25
      year: "numeric", // 2026
    });
  };

  return (
    <div className="  rounded-xl ">
      <div className={`flex   flex-col md:flex-row md:justify-between`}>
        <div className="flex flex-row gap-4">
          <input
            ref={fileRef}
            disabled={updating}
            id={`thumbnail-${item.id}`}
            name={`thumbnail-${item.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => updateThumbnail(e.target.files[0], item.id)}
          />
          <div className="flex flex-col md:items-center md:justify-center">
            <div
              className={`group  rounded-md text-[8px] h-[117px] w-20 md:w-36 md:h-36 transition-colors relative ${
                updating
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-200"
              }`}
              onClick={() => {
                if (updating || !canEdit) return;
                fileRef.current?.click();
              }}
            >
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}

              {item.companyDetails.image?.url ? (
                <>
                  <img
                    src={item.companyDetails.image?.url}
                    alt="Thumbnail"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    className={`h-full w-full object-cover rounded-md transition ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </>
              ) : (
                <>
                  <div className="cursor-pointer h-5 w-5">
                    <svg
                      viewBox="0 0 33 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5016 8.80156C16.5016 10.7111 15.743 12.5425 14.3927 13.8927C13.0425 15.243 11.2111 16.0016 9.30156 16.0016C7.392 16.0016 5.56066 15.243 4.21039 13.8927C2.86013 12.5425 2.10156 10.7111 2.10156 8.80156C2.10156 6.892 2.86013 5.06066 4.21039 3.71039C5.56066 2.36013 7.392 1.60156 9.30156 1.60156C11.2111 1.60156 13.0425 2.36013 14.3927 3.71039C15.743 5.06066 16.5016 6.892 16.5016 8.80156ZM10.1016 5.60156C10.1016 5.38939 10.0173 5.18591 9.86725 5.03588C9.71722 4.88585 9.51374 4.80156 9.30156 4.80156C9.08939 4.80156 8.88591 4.88585 8.73588 5.03588C8.58585 5.18591 8.50156 5.38939 8.50156 5.60156V8.00156H6.10156C5.88939 8.00156 5.68591 8.08585 5.53588 8.23588C5.38585 8.38591 5.30156 8.58939 5.30156 8.80156C5.30156 9.01374 5.38585 9.21722 5.53588 9.36725C5.68591 9.51728 5.88939 9.60156 6.10156 9.60156H8.50156V12.0016C8.50156 12.2137 8.58585 12.4172 8.73588 12.5672C8.88591 12.7173 9.08939 12.8016 9.30156 12.8016C9.51374 12.8016 9.71722 12.7173 9.86725 12.5672C10.0173 12.4172 10.1016 12.2137 10.1016 12.0016V9.60156H12.5016C12.7137 9.60156 12.9172 9.51728 13.0672 9.36725C13.2173 9.21722 13.3016 9.01374 13.3016 8.80156C13.3016 8.58939 13.2173 8.38591 13.0672 8.23588C12.9172 8.08585 12.7137 8.00156 12.5016 8.00156H10.1016V5.60156ZM22.9016 6.40156H17.7704C17.6135 5.84899 17.4029 5.3131 17.1416 4.80156H22.9016C24.1746 4.80156 25.3955 5.30728 26.2957 6.20745C27.1959 7.10763 27.7016 8.32852 27.7016 9.60156V22.4016C27.7016 23.6746 27.1959 24.8955 26.2957 25.7957C25.3955 26.6959 24.1746 27.2016 22.9016 27.2016H10.1016C8.82852 27.2016 7.60763 26.6959 6.70745 25.7957C5.80728 24.8955 5.30156 23.6746 5.30156 22.4016V16.6416C5.8093 16.9018 6.34263 17.1114 6.90156 17.2704V22.4016C6.90156 22.9984 7.06476 23.5568 7.34956 24.0336L14.82 16.6928C15.2687 16.2521 15.8726 16.0051 16.5016 16.0051C17.1305 16.0051 17.7344 16.2521 18.1832 16.6928L25.6552 24.0336C25.9477 23.5395 26.1019 22.9758 26.1016 22.4016V9.60156C26.1016 8.75287 25.7644 7.93894 25.1643 7.33882C24.5642 6.7387 23.7503 6.40156 22.9016 6.40156ZM22.9016 12.0016C22.9016 12.3167 22.8395 12.6288 22.7189 12.92C22.5983 13.2112 22.4215 13.4758 22.1986 13.6986C21.9758 13.9215 21.7112 14.0983 21.42 14.2189C21.1288 14.3395 20.8167 14.4016 20.5016 14.4016C20.1864 14.4016 19.8743 14.3395 19.5831 14.2189C19.2919 14.0983 19.0274 13.9215 18.8045 13.6986C18.5816 13.4758 18.4049 13.2112 18.2843 12.92C18.1636 12.6288 18.1016 12.3167 18.1016 12.0016C18.1016 11.365 18.3544 10.7546 18.8045 10.3045C19.2546 9.85442 19.865 9.60156 20.5016 9.60156C21.1381 9.60156 21.7485 9.85442 22.1986 10.3045C22.6487 10.7546 22.9016 11.365 22.9016 12.0016ZM21.3016 12.0016C21.3016 11.7894 21.2173 11.5859 21.0672 11.4359C20.9172 11.2858 20.7137 11.2016 20.5016 11.2016C20.2894 11.2016 20.0859 11.2858 19.9359 11.4359C19.7858 11.5859 19.7016 11.7894 19.7016 12.0016C19.7016 12.2137 19.7858 12.4172 19.9359 12.5672C20.0859 12.7173 20.2894 12.8016 20.5016 12.8016C20.7137 12.8016 20.9172 12.7173 21.0672 12.5672C21.2173 12.4172 21.3016 12.2137 21.3016 12.0016ZM8.48236 25.1632C8.97351 25.4507 9.53245 25.602 10.1016 25.6016H22.9016C23.4936 25.6016 24.0456 25.4416 24.5208 25.1632L17.0616 17.8352C16.912 17.6886 16.711 17.6065 16.5016 17.6065C16.2922 17.6065 16.0911 17.6886 15.9416 17.8352L8.48236 25.1632Z"
                        fill="#3B3B3B"
                      />
                    </svg>
                  </div>
                  <span>Add Thumbnail</span>
                </>
              )}
            </div>
          </div>
          <div className="text-[10px] md:text-[13px] text-[#8A8A8A] lg:text-sm space-y-0.5">
            <h1 className=" font-semibold capitalize  text-[13px] md:text-[20px] lg:text-[22px] text-[#3B3B3B] wrap-break-word whitespace-normal">
              {item.companyDetails.shopName}
            </h1>
            {item.companyDetails.gstNumber && (
            <p className="break-all whitespace-normal">
              {item.companyDetails.gstNumber}
            </p>
            )}
            <p className="break-all whitespace-normal">
              {item.companyDetails.email}
            </p>

            <div className="flex items-center gap-1   mt-1 ">
              <IoLocation className="text-primary text-[10px] md:text-sm" />
              <span>
                {" "}
                {item.companyDetails?.city}, {item.companyDetails?.country}
              </span>
            </div>
            <div className="text-[10px] lg:text-[13px] bg-[#F0F0F0]  px-2 py-1 md:py-1.5 rounded-md w-fit text-[#636363] mt-2">
              <div className="flex">
                {" "}
                <p className="pl-1">{formatDate(item.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-2 justify-between  flex-row md:flex-col md:justify-start md:mt-0">
          <div
            className={`flex items-end md:justify-end gap-2 h-[40px] ${
              status !== "approved" && status !== "pending"
                ? "invisible"
                : "visible"
            }`}
          >
            {status === "pending" && (
              <button
                disabled={updating}
                onClick={() => onEdit(item)}
                type="button"
                className={`p-2 cursor-pointer bg-gray-100 text-gray-700 rounded-lg transition 
              ${
                updating
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:text-gray-500"
              }`}
              >
                Edit
                {/* <MdOutlineEdit className="text-sm lg:text-xl" /> */}
              </button>
            )}
            {/* {(status === "approved" || status === "pending") && (
              <button
                disabled={updating}
                onClick={() => onDelete(item.id)}
                className={`p-2 bg-gray-100 text-red-500 rounded-lg transition
                          ${
                            updating
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:text-red-700"
                          }`}
              >
                <RiDeleteBin5Line className="text-sm lg:text-xl" />
              </button>
            )} */}
            {/* {(status === "pending" || status === "approved") && (
              <button
                onClick={() => handleCancel(item.id)}
                className="p-2 cursor-pointer bg-gray-100 text-red-500 rounded-lg"
              >
                Cancel
              </button>
            )} */}
          </div>

          <div>
            <div
              className={`hidden  md:flex   mt-17 items-center  capitalize  gap-2 text-[13px] font-medium px-3 py-1.5 rounded-md
                 ${
                   status === "approved"
                     ? "bg-[#F0FFEF] text-[#05A100]"
                     : status === "cancelled"
                       ? "bg-[#FFE7E7] text-red-600"
                       : status === "rejected"
                         ? "bg-gray-100 text-[#6B7280]"
                         : "bg-yellow-50 text-[#FF9D00]"
                 }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "approved"
                    ? "bg-green-500"
                    : status === "cancelled"
                      ? "bg-red-500"
                      : status === "rejected"
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                }`}
              />
              <span className="text-[#282828]">Status:</span>
              {status}
            </div>
          </div>
          <div
            className={` flex md:hidden   capitalize items-center gap-2 text-[10px]  font-medium px-3 py-1 rounded-md
                ${
                  status === "approved"
                    ? "bg-[#F0FFEF] text-[#05A100]"
                    : status === "cancelled"
                      ? "bg-[#FFE7E7] text-red-600"
                      : status === "rejected"
                        ? "bg-gray-100 text-[#6B7280]"
                        : "bg-yellow-50 text-[#FF9D00]"
                }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                status === "approved"
                  ? "bg-green-500"
                  : status === "cancelled"
                    ? "bg-red-500"
                    : status === "rejected"
                      ? "bg-gray-500 "
                      : "bg-yellow-500"
              }`}
            />
            <span className="text-[#282828]"> Status:</span> {status}
          </div>
        </div>
      </div>

      <div className="border-b py-3 border-gray-200" />
      <div className="flex  justify-between">
        <h1 className="text-[#000000] mt-4 font-medium  text-sm lg:text-base">
          Uploaded Slabs
        </h1>
        {status.toLowerCase() === "approved" && item.products.length < 2 && (
          <button
            onClick={() =>
              router.push(`${addSlabRoute}/${item.id}/add-product`)
            }
            className="mt-2 bg-primary font-medium text-white px-4 md:px-6 cursor-pointer hover:bg-pink-100 hover:text-primary py-1.5 rounded-md text-xs md:text-sm hover:bg-green-700 transition"
          >
            Add Product
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4">
        {item.products?.map((product, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-xl p-3 shadow-sm"
          >
            <div className="relative w-full h-40 mb-4 rounded-lg bg-gray-100">
              {productImageLoading[i] !== false && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                </div>
              )}

              <img
                src={
                  product.thumbnail?.url ||
                  product.media?.find((m) => m?.type?.startsWith("image"))?.url
                }
                alt={product.productName}
                onLoad={() =>
                  setProductImageLoading((prev) => ({ ...prev, [i]: false }))
                }
                onError={() =>
                  setProductImageLoading((prev) => ({ ...prev, [i]: false }))
                }
                className={`w-full h-40 object-cover object-top rounded-lg transition ${
                  productImageLoading[i] !== false ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>

            <h3 className="font-medium text-[#292929] capitalize text-sm  md:text-base ">
              {product.productName}
            </h3>

            <p className="text-xs capitalize font-medium md:text-sm text-[#838383]">
              {product.category}
            </p>
            <p className="text-base capitalize font-medium md:text-xl xl:text-[22px] ">
              {/* <span className="font-medium text-[#000000]">
                Price Per Unit:
              </span>{" "} */}
              {product.currency} {product.pricePerProduct}
            </p>

            <div className="flex  justify-between text-[#838383]  text-xs  md:text-sm mt-2 md:gap-4 md:gap-y-1">
              <p>
                <span className="font-medium text-[#000000]">Weight:</span>{" "}
                {product.weight}
              </p>
              <p>
                <span className="font-medium text-[#000000]">Sizes:</span> H:{" "}
                {product?.size?.height || "-"} | W:{" "}
                {product?.size?.width || "-"}
              </p>
            </div>

            <div className="my-3 border-b border-gray-300" />

            <div className="flex mt-2 justify-between">
              <button
                onClick={() => onViewDetails(item, product)}
                className=" bg-primary/10  font-medium cursor-pointer text-primary text-xs md:text-sm px-2 md:px-4 py-2 rounded-md hover:bg-primary/20 transition"
              >
                View Details
              </button>
              {/* {(status === "approved" || status === "pending") && (
                <button
                  onClick={() => onProductDelete(item, product)}
                  className="text-xs outline-none md:text-sm px-4 md:px-6 py-2 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50 text-gray-800 border border-gray-200 "
                >
                  Delete
                </button>
              )} */}
            </div>
            {/* {product.feedbackStatus && product.feedbackStatus === "pending" && (
              <div className="bg-pink-50 p-3 mt-2 rounded-md">
                <p className="text-gray-800 mb-2 text-xs md:text-sm">
                  {product.feedbackMessage}
                </p>
                <div className=" flex justify-end items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!item?.id || !product?.id) return;

                        handleProductFeedback(item.id, product.id, "cancel");
                      }}
                      className="px-3 py-1 cursor-pointer bg-gray-200 text-black rounded-md hover:bg-gray-300 text-xs md:text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        if (!item?.id || !product?.id) return;
                        handleProductFeedback(item.id, product.id, "ok");
                      }}
                      className="px-3 py-1 cursor-pointer bg-primary text-white rounded-md hover:bg-primary/80 text-xs md:text-sm"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
