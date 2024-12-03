import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./LoopSlider.module.css";
import { WorkDetail } from "@/pages/challenges/[challengeId]/index.jsx";
import { useViewport } from "@/context/ViewportProvider.jsx";

const LoopSlider = ({ pages }) => {
	const viewport = useViewport();
	const [currentPage, setCurrentPage] = useState(1); // 실제 페이지는 1번부터 시작
	const [isAnimating, setIsAnimating] = useState(false);

	const extendedPages = [pages[pages.length - 1], ...pages, pages[0]]; // 앞뒤에 더미 페이지 추가

	const handleNext = () => {
		if (!isAnimating) {
			setCurrentPage((prev) => prev + 1);
			setIsAnimating(true);
		}
	};

	const handlePrev = () => {
		if (!isAnimating) {
			setCurrentPage((prev) => prev - 1);
			setIsAnimating(true);
		}
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: handleNext,
		onSwipedRight: handlePrev,
		preventScrollOnSwipe: true,
		trackMouse: true,
	});

	// 무한 루프 처리: 애니메이션 없이 위치 조정
	useEffect(() => {
		if (currentPage === 0) {
			setTimeout(() => {
				setIsAnimating(false);
				setCurrentPage(pages.length);
			}, 500); // 애니메이션 시간 후 위치 조정
		} else if (currentPage === pages.length + 1) {
			setTimeout(() => {
				setIsAnimating(false);
				setCurrentPage(1);
			}, 500);
		} else {
			setTimeout(() => setIsAnimating(false), 500);
		}
	}, [currentPage, pages.length]);

	return (
		<div className={styles.loopSliderContainer} {...swipeHandlers}>
			<div
				className={styles.loopSliderWrapper}
				style={{
					transform: `translateX(-${currentPage * 100}%)`,
					transition: isAnimating ? "transform 0.5s ease-in-out" : "none",
				}}
			>
				{extendedPages.map((page, index) => (
					<div className={styles.loopSliderPage} key={index}>
						<WorkDetail work={page} viewport={viewport} />
					</div>
				))}
			</div>
			<button className={`${styles.loopSliderButton} ${styles.left}`} onClick={handlePrev}>
				◀
			</button>
			<button className={`${styles.loopSliderButton} ${styles.right}`} onClick={handleNext}>
				▶
			</button>
			<div className={styles.pageIndicators}>
				{pages.map((_, index) => (
					<span
						key={index}
						className={`${styles.indicator} ${currentPage - 1 === index ? styles.active : ""
							}`}
					></span>
				))}
			</div>
		</div>
	);
};

export default LoopSlider;
