import styles from "@/styles/Notis.module.css";
import { getNotis } from "@/apis/notisService.js";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserProvider.jsx";
import moment from "moment";

const PAGE_LIMIT = 10;

export function NotiRead({ noti }) {
	return (
		<div className={styles.notiRead}>
			<div className={styles.notiMessage}>{noti.message}</div>
			<div className={styles.notiDate}>{moment(new Date(noti.createdAt)).format("YYYY-MM-DD hh:mm")}</div>
		</div>
	)
}

function NotisRead() {
	const user = useUser();
	const {
		data: notisReadData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["notisRead", user?.id],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => getNotis({ page: pageParam, limit: PAGE_LIMIT, is_read: true }),
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => lastPage?.notifications?.hasMore ? lastPageParam + 1 : undefined,
	});

	return (
		<div className={styles.notisRead}>
			<h2>읽은 알림들</h2>
			{notisReadData?.pages?.map((page) => page?.notifications?.list?.map((noti) => <NotiRead key={noti.id} noti={noti} />))}
			{hasNextPage ? <button onClick={fetchNextPage} disabled={isFetchingNextPage}>더보기<Image width={viewport.size} height={viewport.size} src="/images/ic_arrow_down.png" alt="See more" /></button>
			: <div className={styles.noMoreNotis}>더이상 읽은 알림이 없습니다.</div>}
		</div>
	);
}

export default NotisRead;
