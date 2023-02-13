// boilerplate next.js component

import { QueryKey, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface Data {
  id: number;
  title: string;
  author: string;
  publication_date: string;
  price: string;
}

export default function Data() {
  const { data, isLoading, error } = useQuery<Data[], Error>(
    ["books"] as QueryKey, // this is the key for the query
    async () => {
      return axios
        .get("http://localhost:8080/api/books")
        .then((res) => res.data);
    }
  );

  return (
    <div>
      <h1>data</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.map((book) => (
            <li key={book.id}>
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
