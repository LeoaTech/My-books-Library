import React from 'react'

const BookDetailsTable = ({book}) => {
    return (
        <table className="mt-4 border-separate border-2 border-purple-900">
            <tbody>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Book Title</td>
                    <td className="p-2 border border-purple-900">{book.title}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Book Author</td>
                    <td className="p-2 border border-purple-900">{book.author}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">ISBN</td>
                    <td className="p-2 border border-purple-900">{book.isbn}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Edition Language</td>
                    <td className="p-2 border border-purple-900">English</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Book Format</td>
                    <td className="p-2 border border-purple-900">{book.format}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Date Published</td>
                    <td className="p-2 border border-purple-900">{book.publish_date}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Publisher</td>
                    <td className="p-2 border border-purple-900">{book.publisher}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Pages</td>
                    <td className="p-2 border border-purple-900">{book.pages}</td>
                </tr>
                <tr>
                    <td className="p-2 border border-purple-900 font-semibold">Tags</td>
                    <td className="p-2 border border-purple-900 flex flex-wrap">
                    {book.tags.map((tag) => (
                        <span className='text-xs ml-2 font-semibold my-1 px-2.5 py-1 rounded bg-black bg-opacity-80 text-white'>{tag}</span>
                    ))}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default BookDetailsTable