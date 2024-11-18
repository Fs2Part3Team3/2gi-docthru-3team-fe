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
  const [field, setField] = useState(initialFieldState);
  const [type, setType] = useState("");
  const [progress, setProgress] = useState("");
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(1);
  const {
    data: challenges,
    isPending,
    isError
  } = useQuery({
    queryKey: ['challenges', query, page],
    queryFn: () => getChallenges(query),
  });
  const router = useRouter();

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
          <div className={styles.filterContainer} onClick={() => setFilterShown(prev => !prev)}>
            <div className={styles.filterText}>필터</div>
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
                <input type="radio" value="ing" name="progress" checked={progress === "ing"} onChange={handleProgressChange} />
                <span>진행중</span>
              </label>
              <label>
                <input type="radio" value="complete" name="progress" checked={progress === "complete"} onChange={handleProgressChange} />
                <span>마감</span>
              </label><br />
            </div>
            <div className={styles.bottom}>
              <button className={styles.button} type="button" onClick={() => {
                setField(initialFieldState);
                setType("");
                setProgress("");
              }}>초기화</button>
              <button className={styles.button} type="button" onClick={() => setQuery({ ...query, ...{ field: 'Next', type: 'Document', progress: false } })}>적용하기</button>
            </div>
          </div>
        </div>
        <div className={styles.search}>
          <div className={styles.searchIcon}><Image width={size} height={size} src="/images/ic_search.png" alt="Search" /></div>
          <input className={styles.searchInput} type="text" placeholder="챌린지 이름을 검색해보세요." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      {challenges?.map?.(challenge => <Challenge key={challenge.id} challenge={challenge} />)}
    </>
  );
}
