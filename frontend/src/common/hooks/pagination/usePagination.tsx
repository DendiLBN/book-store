import { useState } from "react";

export const UsePagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const handleChangePagination = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  return {
    handleChangePagination,
    currentPage,
    itemsPerPage,
  };
};
