const TableCard = ({ title, children }) => (
  <div className="rounded-2xl border border-border bg-background p-6 shadow-lg h-full">
    <h3 className="text-xl font-semibold mb-4 text-text">{title}</h3>
    {children}
  </div>
);


export default TableCard;