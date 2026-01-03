import FormLabel from "@/components/FormLabel";
import ProfileForm from "./ProfileForm";
import { ProfileGet } from "./actions";
import ErrorMessage from "@/components/ErrorMessage";
import { UserProfile } from "./types";
import { PatientFormFields } from "../patients/_components/PatientForm";
import { Patient } from "../patients/types";

function UserDetails({ profile }: { profile: UserProfile }) {
  return (
    <>
      <FormLabel label="First name">
        <input
          name="firstName"
          className="input"
          defaultValue={profile.firstName}
          disabled
        />
      </FormLabel>
      <FormLabel label="Last name">
        <input
          name="lastName"
          className="input"
          defaultValue={profile.lastName}
          disabled
        />
      </FormLabel>
    </>
  );
}

export default async function Profile() {
  const profile = await ProfileGet();
  if (!profile) return <ErrorMessage />;

  return (
    <div className="w-full bg-base-100 rounded-field">
      <div className="flex flex-row">
        <h2 className="w-48 border-r font-bold pl-5 pt-6">Settings</h2>
        <div className="w-full">
          <h2 className="text-xl font-bold mb-2 pl-6 pt-6">Your profile</h2>
          <h3 className="font-semibold pl-6 pt-6">Account information</h3>
          <ProfileForm profile={profile} />

          <h3 className="font-semibold mb-2 pl-6 pt-6">Personal Details</h3>
          <div className="w-full mx-auto max-w-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.userRole === "User" && <UserDetails profile={profile} />}
              {profile.userRole === "Patient" && (
                <PatientFormFields
                  patient={profile as unknown as Patient}
                  disabled
                />
              )}
            </div>
          </div>
          {profile.userRole === "Medic" && (
            <>
              <h3 className="font-semibold mb-2 pl-6 pt-6">Medical Details</h3>
              <div className="w-full mx-auto max-w-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormLabel label="Speciality">
                    <input
                      name="specialty"
                      className="input"
                      defaultValue={profile.specialty}
                      disabled
                    />
                  </FormLabel>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
