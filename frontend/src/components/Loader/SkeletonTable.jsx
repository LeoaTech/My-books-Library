// SkeletonTable.jsx
const SkeletonTable = ({ rows = 8, columns = 4 }) => {
    return (
        <div className="rounded-sm border border-[#E2E8F0] bg-neutral-100 shadow-default p-8 border-b dark:border-[#2E3A47] dark:bg-[#24303F]">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className=" bg-[#F7F9FC] text-left dark:bg-[#313D4A]">
                            {Array.from({ length: columns - 1 }).map((_, index) => (

                                <th key={index} className="min-w-[220px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-32"></div>
                                </th>
                            ))}
                            <th className="min-w-[80px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                                <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-32"></div>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                <td className="py-5 px-4 xl:pl-11">
                                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-32"></div>
                                </td>
                                <td className="py-5 px-4 xl:pl-11">
                                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-24"></div>
                                </td>
                                <td className="py-5 px-4 xl:pl-11">
                                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-40"></div>
                                </td>
                                <td className="py-5 px-4 xl:pl-11">
                                    <div className="flex gap-2">
                                        <div className="h-6 w-6 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                                        <div className="h-6 w-6 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default SkeletonTable;
