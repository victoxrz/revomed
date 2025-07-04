import { VisitItem } from "../types";

export default function VisitItemView({
  className,
  visit,
}: {
  className?: string;
  visit: VisitItem;
}) {
  return (
    <div
      className={`mx-auto rounded-field border w-full max-w-2xl p-6 ${className}`}
    >
      {visit.titles.map((title, index) => (
        <div
          className={
            (index !== visit.titles.length - 1 ? "mb-4" : undefined) + " prose"
          }
          key={index}
        >
          <h4>{title}</h4>
          <p className="prose-sm">{visit.fields[index]}</p>
        </div>
      ))}
      <p className="text-right prose max-w-full prose-sm">
        {new Date(visit.createdAt).toLocaleDateString("ro-md")}
      </p>
    </div>
  );
}
