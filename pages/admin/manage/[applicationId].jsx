import { getApplicationWithId, invalidateApplication } from "@/apis/applicationService.js";
import { Field, Type } from "@/components/Challenge.jsx";
import Error from "@/components/Error.jsx";
import Loading from "@/components/Loading.jsx";
import { useViewport } from "@/context/ViewportProvider.jsx";
import styles from "@/styles/ManageApp.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment, { invalid } from "moment";
import Image from "next/image";
import { useRouter } from 'next/router';
import Modal from "@/components/Modal.jsx";
import { useState, useEffect } from "react";
import PopUp from "@/components/PopUp";

function ManageApp() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [invalidMessage, setInvalidMessage] = useState("");
	const [error, setError] = useState(null);
	const [isUnauthorized, setIsUnauthorized] = useState(false);
	const viewport = useViewport();
	const router = useRouter();
	const { applicationId } = router.query;

	const queryClient = useQueryClient();

	const { data: application, isPending, isError } = useQuery({
		queryKey: ["applications", applicationId],
		queryFn: () => getApplicationWithId(applicationId),
		staleTime: 5 * 60 * 1000,
	});
	console.log("ManageApp applications", application);

	const mutation = useMutation({
		mutationFn: (data) => invalidateApplication(applicationId, data.status, data.invalidationComment),
		onSuccess: (data) => {
			console.log("successfully updated: ", data);
			queryClient.invalidateQueries(["applications", applicationId]);
		},
		onError: (error) => {
			console.error(error);
		}
	})

	useEffect(() => {
	  if (application === "Unauthorized" || (application && application.message?.includes("ForbiddenError"))) {
		setIsUnauthorized(true);
	  } else {
		setIsUnauthorized(false);
	  }
	}, [application]);
  
	if (isPending) return <Loading />;
	if (isUnauthorized) return <PopUp onlyCancel={true} error={{ message: "권한이 없습니다.", onCancel: () => router.push('/login') }} setError={setError} />;

	const { id, challenge } = application;

	const handleReject = () => {
		mutation.mutate({ status: "Rejected", invalidationComment: invalidMessage });

		setIsModalOpen(false);
	}

	const handleApprove = () => {
		mutation.mutate({ status: "Accepted" });
	};

	return (
		<>
		{application && challenge && (
		<main className={styles.main}>
			<div className={styles.challengeInfoContainer}>
				<div className={styles.headContainer}>
					<div className={styles.head}>
						<div className={styles.number}>No.&nbsp;{id}</div>
						{application.status !== "Waiting" && (
						<div className={styles.pending}>
							<div className={`${styles.status} ${styles[application.status]}`}>
								<p>{application.status === "Rejected" ? "신청이 거절된 챌린지입니다." : application.status === "Accepted" ? "신청이 승인된 챌린지입니다." : "삭제된 챌린지 입니다."}</p>
							</div>
							{application.status === "Rejected" && (
							<div className={styles.comment}>
								<h1>신청 거절 사유</h1>
								<p className={styles.commentContent}>{application.invalidationComment}</p>
								<p className={styles.date}>{moment(new Date(application.invalidatedAt)).format("YYYY-MM-DD hh:mm")}</p>
							</div>
							)}
							{application.status === "Invalidated" && application.invalidationComment && (
							<div className={styles.comment}>
								<h1>삭제 사유</h1>
								<p className={styles.commentContent}>{application.invalidationComment}</p>
								<p className={styles.date}>{moment(new Date(application.invalidatedAt)).format("YYYY-MM-DD hh:mm")}</p>
							</div>
							)}
						</div>
						)}
						<h1>{challenge.title}</h1>
						<div className={styles.subHead}>
							<Field field={challenge.field} />
							<Type type={challenge.docType} />
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<div className={styles.description}>{challenge.description}</div>
					{/* <div className={styles.writerContainer}>
						<Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
						<span>{application.userId}</span>
					</div> */}
				</div>
				<div className={styles.challengeDateAndParti}>
					<div className={styles.challengeDeadLine}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_alarm.svg" alt="Alarm" />{moment(new Date(challenge.deadLine)).format("YYYY년 M월 D일 마감")}</div>
					<div className={styles.challengeParticipants}><Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_participants.svg" alt="Alarm" />{challenge.maxParticipants}</div>
				</div>
			</div>
			<div className={styles.originalLinkIframe}>
				<h2>원문 링크</h2>
				<div className={styles.iframeContainer}>
					<iframe src={challenge.docUrl} width="100%" height="100%" />
				</div>
				{application.status === "Waiting" && (
				<div className={styles.buttons}>
					<button className={`${styles.button} ${styles.reject}`} type="button" onClick={() => setIsModalOpen(true)}>거절하기</button>
					<button className={`${styles.button} ${styles.approve}`} type="button" onClick={handleApprove}>{mutation.isLoading ? "처리 중" : "승인하기"}</button>
				</div>
				)}
			</div>
			{isModalOpen && (
				<Modal
					title="거절"
					value={invalidMessage}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleReject}
					onChange={(e) => setInvalidMessage(e.target.value)}
				/>
			)}
		</main>
		)}
		</>
	);
}

export default ManageApp;
