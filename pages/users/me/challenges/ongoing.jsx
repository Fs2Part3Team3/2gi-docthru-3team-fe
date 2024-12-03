import styles from "@/styles/MyChalls.module.css";
import MyChallHeader from "@/components/MyChallHeader.jsx";
import { useState } from 'react';
import { useViewport } from "@/context/ViewportProvider.jsx";
import Image from "next/image";
import { useUser } from "@/context/UserProvider.jsx";
import { useQuery } from "@tanstack/react-query";
import { getMyChallsOngoing } from "@/apis/challengeService.js";
import Challenge from "@/components/Challenge.jsx";
import Loading from "@/components/Loading.jsx";
import Pagination from "@/components/Pagination";
import useAuth from "@/utills/useAuth";
import PopUp from "@/components/PopUp";

const PAGE_SIZE = 5;

function Ongoing() {
	const [page, setPage] = useState(1);
	const user = useUser();
	const viewport = useViewport();
	const [search, setSearch] = useState("");
	const { errorMessage, setErrorMessage } = useAuth();
	const [query, setQuery] = useState({
		page,
		limit: 5,
	});
	const { data: challenges, isPending, isError } = useQuery({
		queryKey: ["challenges", "ongoing", user?.id, { ...query, page }],
		queryFn: () => getMyChallsOngoing({ ...query, page }),
		staleTime: 5 * 60 * 1000,
	});
	console.log("Ongoing challenges", challenges);
  
	if (isPending) return <Loading />;

	return (
		<main className={styles.main}>
			{errorMessage && <PopUp onlyCancel={true} error={errorMessage} setError={setErrorMessage} />}
			<MyChallHeader progress="ongoing" />
			<div className={styles.search}>
				<input type="text" placeholder="챌린지 이름을 검색해보세요." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => {
					if (e.key === "Process") return;
					if (e.code === "Enter" || e.code === "NumpadEnter") {
						setPage(1);
						setQuery({ ...query, keyword: search.trim() ? search.trim() : undefined });
					}
				}} />
				<Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_search.png" alt="Search" onClick={() => {
					setPage(1);
					setQuery({ ...query, keyword: search.trim() ? search.trim() : undefined });
				}} />
			</div>
			<div className={styles.challenges}>
				{challenges?.list?.map(chall => <Challenge key={chall.id} challenge={chall} status="ongoing" />)}
			</div>
			<Pagination page={page} setPage={setPage} pageMaxCandi={Math.ceil(challenges?.totalCount / PAGE_SIZE)} />
		</main>
	);
}

export default Ongoing;
