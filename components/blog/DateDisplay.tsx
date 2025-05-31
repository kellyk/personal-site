export default function DateDisplay({ dateString, className = '' }: { dateString: string; className?: string }) {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  return (
    <time dateTime={dateString} className={`text-gray-600 ${className}`}>
      {formattedDate}
    </time>
  );
}

