
const NotificationCard = ({ template }) => {
  
  const variables = template?.variables && typeof template?.variables === 'string' 
    ? JSON.parse(template?.variables) 
    : Array.isArray(template?.variables) 
      ? template?.variables 
      : [];

  return (
    <div className="mt-5 p-3 rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-[#2E3A47] dark:bg-[#24303F]">
      <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2"> <span className="text-sm mx-1 font-semibold">Event Type:</span>{template?.event}</h1>
      <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{template?.body}</p>
      <div className="flex flex-wrap gap-1 line-clamp-2">
        {variables?.slice(0, 10)?.map((v, idx) => (
          <span key={idx} className="text-sm text-bodydark inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NotificationCard;