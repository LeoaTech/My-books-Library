
import TableCard from "./TableCard";

const RecentlyAddedBooks = ({ books }) => {
    if (!books || books.length === 0) {
        return (
            <TableCard title="Most Recent Books">
                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500 dark:text-gray-400">
                    No Books data available.
                </div>
            </TableCard>
        );
    }
    return (
        <TableCard title="Most Recent Books">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-right">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {books.map((book) => (
                            <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">
                                    <div>{book.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {book.author} • {new Date(book?.created_at).toDateString()}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-right font-semibold text-green-600 dark:text-green-400">{book?.stock || 1}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableCard>
    )
};



export default RecentlyAddedBooks;