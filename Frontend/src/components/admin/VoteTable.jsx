const VoteTable = ({ votes }) => {
    return (
        <div className="table-container">
            <div className="table-header">
                <h3>Recent Votes</h3>
                <button className="btn-action btn-view">View All</button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>End Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {votes.map((vote, index) => (
                        <tr key={index}>
                            <td style={{ fontWeight: '600' }}>{vote.title}</td>
                            <td>{vote.type}</td>
                            <td>
                                <span className={`status-badge ${vote.status === 'Active' ? 'status-active' : 'status-ended'}`}>
                                    {vote.status}
                                </span>
                            </td>
                            <td>{vote.endDate}</td>
                            <td>
                                <button className="btn-action btn-view">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VoteTable;
