export default function FormLabel({
  label,
  error,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string[];
  className?: string;
}) {
  if (!className) className = "";
  return (
    <label className={`${className}`}>
      <span className="label text-sm mb-1">{label}</span>
      {children}
      {error && (
        <div className="text-sm text-red-500 whitespace-pre-line">
          {error.join("\n")}
        </div>
      )}
    </label>
  );
}
