import FormLabel from "@/components/FormLabel";
import { Profile } from "./actions";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const data = ["Email address"];
  return (
    <>
      <form className="w-full mx-auto max-w-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((e) => (
            <FormLabel key={e} label={e}>
              <div className="input flex mb-4 w-full">
                <input name={e} defaultValue={profile.email} />
              </div>
            </FormLabel>
          ))}
        </div>
      </form>
    </>
  );
}
