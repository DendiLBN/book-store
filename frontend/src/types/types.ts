import { Key } from "react";

export type TBookBody = {
  _id: string;
  category: string[];
  key: string;
  title: string;
  rate: number;
  author: string;
  tags: string[];
  avatar: string;
};

export type IBookSearchProps = {
  searchText: string;
  value: string;
};

export type TDeleteBooksButtonProps = {
  selectedRowKeys: Key[];
  loading: boolean;
  onDelete: () => void;
};

export type TUseFilteredBooksProps = {
  searchText: string;
  selectedCategories: string[];
  bookList: TBookBody[];
  setFilteredBooks: (filteredBooks: TBookBody[]) => void;
};

export type TCategorySelectProps = {
  selectedCategories: string[];
  onChangeCategories: (select: string[]) => void;
};

export type TBookSearchProps = {
  searchText: string;
  onSearch: (value: string) => void;
};

export type TFetchBodyRegister = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type TFetchLoginUser = {
  email: string;
  password: string;
};

export type ITokens = {
  accessToken: string;
};

export type TRegisterData = {
  email: string;
  password: string;
};

export type TLoginData = {
  email: string;
  password: string;
};
