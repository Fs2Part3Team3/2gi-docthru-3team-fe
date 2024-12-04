import { useUser } from "@/context/UserProvider.jsx";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "@/styles/Notis.module.css";
import moment from "moment";
import { getNotis, readNoti } from "@/apis/notisService.js";
import { useState } from 'react';
import { useViewport } from "@/context/ViewportProvider.jsx";
import Image from "next/image";

const PAGE_LIMIT = 5;
let timeout;

export function Noti({ noti }) {
	const user = useUser();
	const [isRead, setIsRead] = useState(noti?.isRead);
	const queryClient = useQueryClient();
	const readMutation = useMutation({
		mutationFn: () => {
			if (user) {
				return readNoti(noti?.id)
			}
		},
		onSuccess: (result) => {
			if (result?.message === "알림이 읽음 처리 되었습니다.") {
				setIsRead(true);
			}
			queryClient.invalidateQueries({ queryKey: ["gotNotis", user?.id] });
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ["notis", user?.id] });
			}, 3000);
		},
		onError: (error) => {
			console.error(error);
		}
	});

	return (
		<div className={[styles.noti, isRead ? styles.read : styles.unread].join(" ")}>
			<div className={styles.notiMessage} onClick={async () => {
				if (!isRead) {
					readMutation.mutate();
				}
			}}>
				{noti.message}
			</div>
			<div className={styles.notiDate}>{moment(new Date(noti.createdAt)).format("YYYY-MM-DD")}</div>
		</div>
	)
}

function Notis() {
	const viewport = useViewport();
	const user = useUser();
	const {
		data: notisData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["notis", user?.id],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => getNotis({ page: pageParam, limit: PAGE_LIMIT }),
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => lastPage?.notifications?.hasMore ? lastPageParam + 1 : undefined,
	});
	console.log("notisData", notisData);

	return (
		<div className={styles.notis}>
			{notisData?.pages?.map((page) => page?.notifications?.list?.map((noti) => <Noti key={noti.id} noti={noti} />))}
			{hasNextPage && <button onClick={fetchNextPage} disabled={isFetchingNextPage}>더보기<Image width={viewport.size} height={viewport.size} src="/images/ic_arrow_down.png" alt="See more" /></button>}
		</div>
	)
}

export default Notis;
