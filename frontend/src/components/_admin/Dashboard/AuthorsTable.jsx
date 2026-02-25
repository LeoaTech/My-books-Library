import TableCard from "./TableCard";
const AuthorsTable = ({ authors }) => {
    if (!authors || authors.length === 0) {
        return (
            <TableCard title="Poplular Authors">
                <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 dark:text-gray-400">
                    No Authors data available.
                </div>
            </TableCard>
        );
    }
    return (
        <TableCard title="Poplular Authors">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary">
                    <thead className="bg-secondary">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-text">
                            <th className="px-4 py-3 text-left">Author Name</th>
                            <th className="px-4 py-3 text-right">Available Books</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                        {authors?.map((author) => (
                            <tr key={author.id} className="hover:bg-surface transition-colors">
                                <td className="px-4 py-3 text-md font-medium text-text">{author.name}</td>
                                <td className="px-4 py-3 text-md text-right font-semibold text-text">{author.totalbooks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableCard>
    )
};


export default AuthorsTable