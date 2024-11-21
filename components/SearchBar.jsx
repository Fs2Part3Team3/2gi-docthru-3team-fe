function SearchBar({ search, setSearch }) {
    return (
      <input
        type="text"
        placeholder="챌린지 이름을 검색해보세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    );
  }