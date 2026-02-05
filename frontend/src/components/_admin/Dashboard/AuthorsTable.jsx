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
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                            <th className="px-4 py-3 text-left">Author Name</th>
                            <th className="px-4 py-3 text-right">Available Books</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {authors.map((author) => (
                            <tr key={author.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3 text-md font-medium text-gray-900 dark:text-gray-100">{author.name}</td>
                                <td className="px-4 py-3 text-md text-right font-semibold text-orange-600 dark:text-orange-400">{author.totalbooks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableCard>
    )
};


export default AuthorsTable