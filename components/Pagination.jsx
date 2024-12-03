import styles from "./Pagination.module.css";

function Pagination({ page, setPage, pageMaxCandi }) {
  let pageMax = pageMaxCandi ?? 1;
  let paginationBody;
  if (page <= 1) {
    paginationBody = (
      <>
        <div className={styles.selected}>1</div>
        {pageMax >= 2 && <div>2</div>}
        {pageMax >= 3 && <div>3</div>}
        {pageMax >= 4 && <div>4</div>}
        {pageMax >= 5 && <div>5</div>}
      </>
    );
  } else if (page <= pageMax && page === 2) {
    paginationBody = (
      <>
        <div>1</div>
        <div className={styles.selected}>2</div>
        {pageMax >= 3 && <div>3</div>}
        {pageMax >= 4 && <div>4</div>}
        {pageMax >= 5 && <div>5</div>}
      </>
    );
  } else if (page <= pageMax && page === 3) {
    paginationBody = (
      <>
        <div>1</div>
        <div>2</div>
        <div className={styles.selected}>3</div>
        {pageMax >= 4 && <div>4</div>}
        {pageMax >= 5 && <div>5</div>}
      </>
    );
  } else if (page < pageMax - 2 && page > 3) {
    paginationBody = (
      <>
        <div>{page - 2}</div>
        <div>{page - 1}</div>
        <div className={styles.selected}>{page}</div>
        <div>{page + 1}</div>
        <div>{page + 2}</div>
      </>
    );
  } else if (page === pageMax - 2) {
    paginationBody = (
      <>
        <div>{page - 2}</div>
        <div>{page - 1}</div>
        <div className={styles.selected}>{page}</div>
        <div>{page + 1}</div>
        <div>{page + 2}</div>
      </>
    );
  } else if (page === pageMax - 1) {
    paginationBody = (
      <>
        <div>{page - 3}</div>
        <div>{page - 2}</div>
        <div>{page - 1}</div>
        <div className={styles.selected}>{page}</div>
        <div>{page + 1}</div>
      </>
    );
  } else {
    paginationBody = (
      <>
        <div>{pageMax - 4}</div>
        <div>{pageMax - 3}</div>
        <div>{pageMax - 2}</div>
        <div>{pageMax - 1}</div>
        <div className={styles.selected}>{pageMax}</div>
      </>
    );
  }

  return (
    <div
      className={styles.pagination}
      onClick={event => {
        const pages = event.currentTarget.querySelectorAll('div');
        const { target } = event;
        let targetN = Number(target.innerText);
        if (isNaN(targetN)) {
          if (target.innerText === '&lt;' || target.innerText === '<') {
            const pageCandi = Number(pages[1].innerText) - 1;
            setPage(pageCandi <= 1 ? 1 : pageCandi);
          } else if (target.innerText === '&gt;' || target.innerText === '>') {
            const pageCandi = Number(pages[pages.length - 2].innerText) + 1;
            setPage(pageCandi >= pageMax ? pageMax : pageCandi);
          }
        } else {
          if (targetN < 1) {
            targetN = 1;
          } else if (targetN > pageMax) {
            targetN = pageMax;
          }
          setPage(targetN);
        }
      }}
    >
      <div>&lt;</div>
      {paginationBody}
      <div>&gt;</div>
    </div>
  );
}

export default Pagination;
