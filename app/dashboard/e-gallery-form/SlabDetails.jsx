import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import SlabFormFields from "@/app/components/SlabFormFields";

const SlabDetails = forwardRef(
  ({ setProductList, editIndex, setEditIndex, editProduct }, ref) => {
    const initialProductData = {
      stoneCategory: "",
      stoneName: "",
      finish: [],
      thickness: [],
      units: null,
      size: { width: [], height: [] },
      // value: "",
      description: "",
      media: [],
    };


    const [product, setProduct] = useState(initialProductData);
const refs = useRef({
  stoneCategory: null,
  units: null,
  finish: null,
  thickness: null,
  height: null,
  width: null,
});
    useImperativeHandle(ref, () => ({
      focusStoneCategory: () => {
        refs.current.stoneCategory?.focus();
        refs.current.stoneCategory?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
      focusUnits: () => {
        refs.current.units?.focus();
        refs.current.units?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    }));

    useEffect(() => {
      if (editProduct) {
        setProduct(editProduct);
        setTimeout(() => {
          refs.current.stoneCategory?.focus();
          refs.current.stoneCategory?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }, [editProduct]);

    const editCancel = () => {
      setProduct(makeInitialProduct());
      setEditIndex(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handleAddproduct = () => {
      const requiredFields = [
        "stoneCategory",
        "stoneName",
        "finish",
        "thickness",
        "units",
        "size",
      ];
      const formatKey = (key) =>
        key
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim()
          .toLowerCase();

      const generateNumericId = () => {
        return uuidv4().replace(/\D/g, "").slice(0, 6);
      };

      const tempProduct = {
        ...product,
        id: product.id || generateNumericId(),
        // id: product.id || uuidv4(),
        finish: [...product.finish],
        thickness: [...product.thickness],
        units: product.units?.label,
        size: {
          width: [...product.size.width],
          height: [...product.size.height],
        },
      };

      const focusField = (key) => {
        const dropdownKeys = new Set([
          "finish",
          "thickness",
          "height",
          "width",
        ]);
        if (dropdownKeys.has(key)) {
          setOpenDropdown(key);
          setTimeout(() => {
            const el = refs.current[key];
            el?.focus?.();
            el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
          }, 100);
        } else if (key === "units") {
          const el = refs.current.units;
          el?.focus?.();
          el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        } else {
          const el = document.querySelector(`[name="${key}"]`);
          el?.focus?.();
          el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }
      };

      for (const key of requiredFields) {
        const value = tempProduct[key];
        const fieldName = formatKey(key);
        const isEmpty =
          value === "" ||
          value === null ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          toast.error(`Please Enter The ${fieldName}`, { duration: 1000 });
          focusField(key);
          return;
        }
      }

      if (tempProduct.size?.height?.length === 0) {
        toast.error("Please select height");
        return;
      }
      if (tempProduct.size?.width?.length === 0) {
        toast.error("Please select width");
        return;
      }
      if (product.media.length === 0) {
        toast.error("Upload at least 1 image or video", { duration: 1000 });
        return;
      }

      if (editIndex !== null) {
        setProductList((prev) =>
          prev.map((p, i) => (i === editIndex ? tempProduct : p)),
        );
        toast.success("Product updated successfully!");
        setEditIndex(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setProductList((prev) => [...prev, tempProduct]);
        toast.success("Product added successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      setProduct(initialProductData);
    };
    return (
      <>
        <h2 className="text-xs font-medium mb-1">
          Stone Slab Details
          <span className="text-[#CDCDCD] font-normal">
            {" "}
            (Add Multiple Products)
          </span>
        </h2>
        <SlabFormFields
          product={product}
          setProduct={setProduct}
          hideMedia={false}
        />
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
            className="bg-[#871B58] hover:bg-[#6a1545] px-4 py-2 md:px-8 lg:px-10 xl:px-14 rounded-md text-white text-xs cursor-pointer"
          >
            {editIndex != null ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </>
    );
  },
);

export default SlabDetails;
