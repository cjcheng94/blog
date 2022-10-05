import { useState, useEffect } from "react";

const useGetUrlParams = (urlSearch: string) => {
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>("");

  useEffect(() => {
    const urlQuery = new URLSearchParams(urlSearch);
    const searchTerm = urlQuery.get("searchTerm");
    const tagIds = urlQuery.getAll("tagIds");
    const username = urlQuery.get("username");

    setSearchTerm(searchTerm);
    setTagIds(tagIds);
    setUsername(username);
  }, [urlSearch]);

  return { searchTerm, tagIds, username };
};

export default useGetUrlParams;
