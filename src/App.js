import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookelement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleSearch}></input>
      <ul>
        {books.map((book, index) =>
          books.length === index + 1 ? (
            <li ref={lastBookelement}>{book}</li>
          ) : (
            <li>{book}</li>
          )
        )}
      </ul>
      <div>{loading && 'Loading'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
