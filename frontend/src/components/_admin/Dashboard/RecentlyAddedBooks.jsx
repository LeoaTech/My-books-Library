
import TableCard from "./TableCard";

const RecentlyAddedBooks = ({ books }) => {
    if (!books || books.length === 0) {
        return (
            <TableCard title="Most Recent Books">
                <div className="flex items-center justify-center h-full min-h-[300px] text-text">
                    No Books data available.
                </div>
            </TableCard>
        );
    }
    return (
        <TableCard title="Most Recent Books">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary">
                    <thead className="bg-secondary">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-text">
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-right">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                        {books?.map((book) => (
                            <tr key={book.id} className="hover:bg-surface transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-text max-w-xs truncate">
                                    <div>{book.title}</div>
                                    <div className="text-xs text-text mt-0.5">
                                        {book.author} • {new Date(book?.created_at).toDateString()}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-right font-semibold text-primary">{book?.stock || 1}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TableCard>
    )
};



export default RecentlyAddedBooks;