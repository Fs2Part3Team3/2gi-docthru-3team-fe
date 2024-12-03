import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Home from "./home.jsx";

export async function getServerSideProps() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["challenges", { page: 1, limit: 5 }],
		queryFn: () => getChallenges({ page: 1, limit: 5 }),
		staleTime: 5 * 60 * 1000,
	});

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}

export default function HomeRoute({ dehydratedState }) {
	return (
		<HydrationBoundary state = { dehydratedState }>
			<Home />
		</HydrationBoundary>
	);
}