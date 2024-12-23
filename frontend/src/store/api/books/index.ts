import { Key } from "react";
import { AxiosResponse } from "axios";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/common/services/axios-base-query";

import { TBookBodyParams, TBookBodyResponse } from "@/types/api/books";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["books"],
  endpoints: (builder) => ({
    fetchBooks: builder.query<TBookBodyResponse[], TBookBodyParams>({
      query: ({ page = 1, perPage = 100, category = [], searchString }) => ({
        method: "GET",
        url: "books",
        params: {
          page,
          perPage,
          searchString,
          category,
        },
      }),
      transformResponse: ({ data }: AxiosResponse<TBookBodyResponse[]>) =>
        data || [],
      providesTags: (response) =>
        response
          ? response.map((book) => ({ type: "books", id: book._id }))
          : [{ type: "books" }],
    }),
    deleteManyBooks: builder.mutation<void, Key[]>({
      query: (ids) => ({
        method: "POST",
        url: "books/ids",
        data: { ids },
      }),
      invalidatesTags: (response) => (response ? [{ type: "books" }] : []),
    }),
  }),
});

export const { useFetchBooksQuery, useDeleteManyBooksMutation } = bookApi;
