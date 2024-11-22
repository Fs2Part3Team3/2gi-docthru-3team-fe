import { getWorkById } from "@/apis/workService.js";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/router';

function WorkDetail() {
	const router = useRouter();
	const { id: workId } = router.query;
	const { data: work, isPending, isError } = useQuery({
		queryKey: ["works", workId],
		queryFn: () => getWorkById(workId),
		staleTime: 5 * 60 * 1000,
	});
	console.log(work);

	return;
}

export default WorkDetail;
