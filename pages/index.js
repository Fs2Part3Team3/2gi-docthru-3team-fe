import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserProvider.jsx";
import { useEffect, useState } from "react";
import { getChallenges } from "@/apis/challengeService.js";
import Challenge from "@/components/Challenge.jsx";
import X from "@/components/X.jsx";
import { useViewport } from "@/context/ViewportProvider.jsx";
import Pagination from "@/components/Pagination";

const initialFieldState = {
  Next: false,
  Modern: false,
  API: false,
  Web: false,
  Career: false,
}

export default function Home() {
  const user = useUser();
  const viewport = useViewport();
  const [size, setSize] = useState(16);
  const [search, setSearch] = useState("");
  const [filterShown, setFilterShown] = useState(false);
  const [filterNum, setFilterNum] = useState(0);
  const [field, setField] = useState(initialFieldState);
  const [type, setType] = useState("");
  const [progress, setProgress] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState({
    page,
    limit,
  });
  const {
    data: challenges,
    isPending,
    isError
  } = useQuery({
    queryKey: ['challenges', query, page],
    queryFn: () => getChallenges(query),
  });
  const router = useRouter();
  console.log(challenges);

  useEffect(() => {
    if (viewport) {
      setSize(viewport.size);
    }
  }, [viewport]);

  const handleFieldChange = (e) => {
    setField((prev) => ({
      ...prev,
      [e.target.value]: !prev[e.target.value],
    }));
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <>
      <div className={styles.head}>
        <h1>챌린지 목록</h1>
        {/* TODO: user && */}
        {true && <button className={styles.button} type="button" onClick={() => {router.push('/challenges/new')}}>신규 챌린지 신청 <Image width={size} height={size} src="/images/ic_plus.png" alt="New challenge" /></button>}
      </div>
      <div className={styles.subHead}>
        <div className={styles.filter}>
          <div className={[styles.filterContainer, (filterNum ? styles.filtered : styles.unfiltered)].join(" ")} onClick={() => setFilterShown(prev => !prev)}>
            <div className={styles.filterText}>필터{filterNum ? `(${filterNum})` : ""}</div>
            <div className={styles.filterIcon}><Image width={size} height={size} src="/images/ic_filter.png" alt="Filter" /></div>
          </div>
          <div className={filterShown ? styles.filterDropdown : `none ${styles.filterDropdown}`}>
            <div className={styles.head}>
              <h3>필터</h3>
              <X width={size} height={size} onClick={() => setFilterShown(false)} />
            </div>
            <div className={styles.filterDropdownItem}>
              <h4>분야</h4>
              <label>
                <input type="checkbox" name="field" value="Next" checked={field.Next} onChange={handleFieldChange} />
                <span>Next.js</span>
              </label>
              <label>
                <input type="checkbox" name="field" value="Modern" checked={field.Modern} onChange={handleFieldChange} />
                <span>Modern JS</span>
              </label>
              <label>
                <input type="checkbox" name="field" value="API" checked={field.API} onChange={handleFieldChange} />
                <span>API</span>
              </label>
              <label>
                <input type="checkbox" name="field" value="Web" checked={field.Web} onChange={handleFieldChange} />
                <span>Web</span>
              </label>
              <label>
                <input type="checkbox" name="field" value="Career" checked={field.Career} onChange={handleFieldChange} />
                <span>Career</span>
              </label><br />
            </div>
            <div className={styles.filterDropdownItem}>
              <h4>문서 타입</h4>
              <label>
                <input type="radio" name="type" value="Document" checked={type === "Document"} onChange={handleTypeChange} />
                <span>공식문서</span>
              </label>
              <label>
                <input type="radio" name="type" value="Blog" checked={type === "Blog"} onChange={handleTypeChange} />
                <span>블로그</span>
              </label><br />
            </div>
            <div className={styles.filterDropdownItem}>
              <h4>상태</h4>
              <label>
                <input type="radio" value="ongoing" name="progress" checked={progress === "ongoing"} onChange={handleProgressChange} />
                <span>진행중</span>
              </label>
              <label>
                <input type="radio" value="completed" name="progress" checked={progress === "completed"} onChange={handleProgressChange} />
                <span>마감</span>
              </label><br />
            </div>
            <div className={styles.bottom}>
              <button className={styles.button} type="button" onClick={() => {
                setField(initialFieldState);
                setType("");
                setProgress("");
                setQuery({ page, limit });
                setFilterNum(0);
              }}>초기화</button>
              <button className={styles.button} type="button" onClick={() => {
                let fieldKeys = Object.keys(field).filter(key => field[key]);
                setFilterNum(fieldKeys.length + (type ? 1 : 0) + (progress ? 1 : 0));
                if (fieldKeys.length) {
                  fieldKeys = fieldKeys.join(",");
                } else {
                  fieldKeys = undefined;
                }
                setQuery({ ...query, ...{ field: fieldKeys, type: type ? type : undefined, progress: progress ? progress : undefined }});
                setFilterShown(false);
              }}>적용하기</button>
            </div>
          </div>
        </div>
        <div className={styles.search}>
          <div className={styles.searchIcon}><Image width={size} height={size} src="/images/ic_search.png" alt="Search" onClick={() => {
            setPage(1);
            setQuery({ ...query, keyword: search.trim() ? search.trim() : undefined });
          }} /></div>
          <input className={styles.searchInput} type="text" placeholder="챌린지 이름을 검색해보세요." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Process") return;
            if (e.code === "Enter" || e.code === "NumpadEnter") {
              setPage(1);
              setQuery({ ...query, keyword: search.trim() ? search.trim() : undefined });
            }
          }} />
        </div>
      </div>
      {challenges?.data?.map?.(challenge => <Challenge key={challenge.id} challenge={challenge} />)
      || <div className={styles.noResult}>아직 챌린지가 없어요.<br />지금 바로 챌린지를 신청해보세요!</div>}
      <Pagination page={page} setPage={setPage} pageMaxCandi={Math.ceil(challenges?.totalCount / limit)} />
    </>
  );
}
