export default function ErrorMessage({
  className,
  message = "Oops. Something went wrong!",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={`border border-error text-error bg-base-100 rounded-field w-full mx-auto max-w-2xl px-4 py-2 ${className}`}
    >
      <p className="text-sm">
        <b className="text-base">Error </b>
        <br />
        {message}
      </p>
    </div>
  );
}
