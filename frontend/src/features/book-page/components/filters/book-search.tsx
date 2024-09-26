import { Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import { TBookSearchProps } from "@/types/types";
import { useControledDebounce } from "@/common/hooks/debounce/useControledDebounce";
import { useEffect } from "react";

export const BookSearch: React.FC<TBookSearchProps> = ({ onSearch }) => {
  const { value, debouncedValue, handleDebouncedValue } =
    useControledDebounce();

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <Input
      placeholder="Search by Title or Author"
      value={value}
      onChange={(e) => handleDebouncedValue(e.target.value)}
      prefix={<SearchOutlined />}
      style={{ marginBottom: 30, width: "200px" }}
    />
  );
};
