export default function ErrorMessage({
  className,
  message,
}: {
  className?: string;
  message?: string;
}) {
  if (!message) message = "Oops. Something went wrong!";
  return (
    <div className={`mx-auto max-w-2xl px-4 ${className}`}>
      <h1 className="text-2xl font-bold mb-6">Error</h1>
      <p className="text-red-500">{message}</p>
    </div>
  );
}
