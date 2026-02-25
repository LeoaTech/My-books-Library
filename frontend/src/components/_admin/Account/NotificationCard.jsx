
const NotificationCard = ({ template }) => {
  
  const variables = template?.variables && typeof template?.variables === 'string' 
    ? JSON.parse(template?.variables) 
    : Array.isArray(template?.variables) 
      ? template?.variables 
      : [];

  return (
    <div className="mt-5 p-3 rounded-lg border border-stroke bg-surface py-6 px-7.5 shadow-default">
      <h1 className="text-sm font-bold text-primary mb-2"> <span className="text-sm mx-1 font-semibold">Event Type:</span>{template?.event}</h1>
      <p className="line-clamp-3 text-sm text-text mb-3 leading-relaxed">{template?.body}</p>
      <div className="flex flex-wrap gap-1 line-clamp-2">
        {variables?.slice(0, 10)?.map((v, idx) => (
          <span key={idx} className="text-xs text-bodydark inline-flex items-center px-2.5 py-1 rounded-md font-medium bg-background text-text border border-primary ">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NotificationCard;