function ChallengeTable({ challenges, onStatusChange }) {
    return (
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>분야</th>
            <th>카테고리</th>
            <th>챌린지 제목</th>
            <th>모집 인원</th>
            <th>신청일</th>
            <th>마감 기한</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge, index) => (
            <tr key={challenge.id}>
              <td>{challenge.id}</td>
              <td>{challenge.category}</td>
              <td>{challenge.subcategory}</td>
              <td>{challenge.title}</td>
              <td>{challenge.maxParticipants}</td>
              <td>{challenge.applicationDate}</td>
              <td>{challenge.deadline}</td>
              <td>
                <select
                  value={challenge.status}
                  onChange={(e) =>
                    onStatusChange(challenge.id, e.target.value)
                  }
                >
                  <option value="신청 승인">신청 승인</option>
                  <option value="신청 거절">신청 거절</option>
                  <option value="신청 대기">신청 대기</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }