import { TYPE, FIELD } from "@/apis/translate.js";
import styles from "./Table.module.css";
import moment from "moment";
import Link from "next/link";

function Table({ applications, me }) {
  return (
    <div className={styles.tableContainer}>
      {(!applications || applications?.length === 0) ? <p className={styles.no}>데이터가 없습니다.</p> : (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>No.</th>
              <th className={styles.th}>분야</th>
              <th className={styles.th}>카테고리</th>
              <th className={styles.th}>챌린지 제목</th>
              <th className={styles.th}>모집 인원</th>
              <th className={styles.th}>신청일</th>
              <th className={styles.th}>마감 기한</th>
              <th className={styles.th}>상태</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
              const { id, challenge: { docType, field, title, maxParticipants, deadLine }, appliedAt, status } = app;
              return (
                <tr key={id}>
                  <td className={styles.td}>{id}</td>
                  <td className={styles.td}>{TYPE[docType]}</td>
                  <td className={styles.td}>{[FIELD[field]]}</td>
                  <td className={styles.td}><Link href={me ? `/users/me/challenges/applied/${id}` : `/admin/manage/${id}`}>{title}</Link></td>
                  <td className={styles.td}>{maxParticipants}</td>
                  <td className={styles.td}>{moment(new Date(appliedAt)).format("YY/MM/DD")}</td>
                  <td className={styles.td}>{moment(new Date(deadLine)).format("YY/MM/DD")}</td>
                  <td className={styles.td}>
                    <p className={styles[status]}>{status === "Waiting" ? "승인 대기" : status === "Rejected" ? "신청 거절" : status === "Invalidated" ? "챌린지 삭제" : "신청 승인"}</p></td>
                </tr>);
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
