import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import css from "./Search.module.css";

export function Search({
  initQuery = "",
  onSearch,
}: {
  initQuery: string;
  onSearch?: (query: string) => void;
}) {
  const [query, setQuery] = useState(initQuery);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className={css.searchform}>
      <button type="submit" className={css.searchbutton}>
        <FaSearch />
      </button>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        className={css.searchinput}
      />
    </form>
  );
}
