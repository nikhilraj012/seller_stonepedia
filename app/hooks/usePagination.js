import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const usePagination = ({
  data = [],
  itemsPerPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
    
    // Create new URLSearchParams to update the page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentPage,
    paginatedData,
    itemsPerPage,
    onPageChange,
  };
};

export default usePagination;