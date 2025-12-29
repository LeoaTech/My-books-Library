
import TableCard from "./TableCard";

const RecentlyAddedBooks = ({ books }) => (
    <TableCard title="Most Recent Books">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Author</th>
                        <th className="px-4 py-3 text-right">Date Added</th>
                        <th className="px-4 py-3 text-right">Stock</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {books.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">{book.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{book.author}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{new Date(book?.created_at).toDateString() }</td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-green-600 dark:text-green-400">{book?.stock ||1}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </TableCard>
);



export default RecentlyAddedBooks;