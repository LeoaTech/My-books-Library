const TableCard = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 h-full">
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
    {children}
  </div>
);


export default TableCard;