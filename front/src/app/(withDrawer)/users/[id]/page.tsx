import ErrorMessage from "@/components/ErrorMessage";
import RequireRoles from "@/components/RequireRoles";
import { User } from "@/lib/actions";
import { UserTabsProvider } from "../_components/UserTabsProvider";
import UserTabs from "../_components/UserTabs";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  await RequireRoles(ROUTES_ROLES.USERS.GET);

  const userId = (await params).id;
  const userData = await User.getById(userId);
  if (!userData) return <ErrorMessage />;

  return (
    <div>
      <div className="flex items-center justify-between p-6 mb-3 bg-base-100 rounded-field">
        <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
      </div>
      <UserTabsProvider value={{ user: userData }}>
        <UserTabs />
      </UserTabsProvider>
    </div>
  );
}
