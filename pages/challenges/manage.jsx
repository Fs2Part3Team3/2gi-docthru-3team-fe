import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ChallengeTable from "@/components/ChallengeTable";
import Pagination from "@/components/Pagination";
import Dropdown from "@/components/Dropdown"

function Manage() {
  const [search, setSearch] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState(Data);
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 10;

  const totalPages = Math.ceil(Data.length / challengesPerPage);

  useEffect(() => {
    const filtered = Data.filter((challenge) =>
      challenge.title.includes(search)
    );
    setFilteredChallenges(filtered);
  }, [search]);

  const currentChallenges = filteredChallenges.slice(
    (currentPage - 1) * challengesPerPage,
    currentPage * challengesPerPage
  );

  const handleStatusChange = (id, status) => {
    const updatedChallenges = Data.map((challenge) =>
      challenge.id === id ? { ...challenge, status } : challenge
    );
    setFilteredChallenges(updatedChallenges);
  };

  return (
    <div>
      <h1>챌린지 신청 관리</h1>
      <SearchBar search={search} setSearch={setSearch} />
      <Dropdown />
      <ChallengeTable
        challenges={currentChallenges}
        onStatusChange={handleStatusChange}
      />
      <Pagination 
        page={page} 
        setPage={setPage} 
        pageMaxCandi={totalPages} 
      />
    </div>
  );
}

export default Manage;