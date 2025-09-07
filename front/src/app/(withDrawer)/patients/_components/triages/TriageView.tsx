import { Triage } from "./types";

export default function TriageView({
  className,
  triage,
}: {
  triage: Triage;
  className?: string;
}) {
  let bmi = triage.weight / (triage.height / 100) ** 2;

  const display = Number.isFinite(bmi) ? bmi.toFixed(1) : "--";

  const categories = [
    [16, "Subponderal sever", "badge badge-fg-base-100 badge-blue-800"],
    [17, "Suponderal moderat", "badge badge-fg-base-100 badge-blue-500"],
    [18.5, "Subponderal ușor", "badge badge-fg-base-100 badge-cyan-500"],
    [25, "Greutate normală", "badge badge-fg-green-700 badge-green-200"],
    [30, "Supraponderal", "badge badge-fg-yellow-700 badge-yellow-300"],
    [35, "Obezitate grad I", "badge badge-fg-base-100 badge-orange-500"],
    [40, "Obezitate grad II (severă)", "badge badge-fg-base-100 badge-red-500"],
    [
      Infinity,
      "Obezitate grad III (morbidă)",
      "badge badge-fg-base-100 badge-red-700",
    ],
  ] as const;

  const [_, label, badgeClass] =
    categories.find(([max]) => Number.isFinite(bmi) && bmi < max) ??
    categories[categories.length - 1];

  return (
    <div className={"rounded-box text-sm " + className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section>
          <h4>Temperature (°C)</h4>
          <p>{triage.temperature}</p>
        </section>

        <section>
          <h4>Systolic Pressure (mmHg)</h4>
          <p>{triage.systolicPressure}</p>
        </section>

        <section>
          <h4>Diastolic Pressure (mmHg)</h4>
          <p>{triage.diastolicPressure}</p>
        </section>

        <section>
          <h4>Heart Rate (bpm)</h4>
          <p>{triage.heartRate}</p>
        </section>

        <section>
          <h4>Respiratory Rate (breaths/min)</h4>
          <p>{triage.respiratoryRate}</p>
        </section>

        <section>
          <h4>Weight (kg)</h4>
          <p>{triage.weight}</p>
        </section>

        <section>
          <h4>Height (cm)</h4>
          <p>{triage.height}</p>
        </section>

        <section>
          <h4>BMI</h4>
          <p>
            {display} <span className={badgeClass}>{label}</span>
          </p>
        </section>

        <section>
          <h4>Waist Circumference (cm)</h4>
          <p>{triage.waistCircumference}</p>
        </section>
      </div>
      <p className="flex justify-between items-center max-w-full text-gray-500">
        <span>{"Poate numele medicului"}</span>
        {triage.updatedAt && (
          <span>{new Date(triage.updatedAt).toLocaleString("ro-md")}</span>
        )}
      </p>
    </div>
  );
}
