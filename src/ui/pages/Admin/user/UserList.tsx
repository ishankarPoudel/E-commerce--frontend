import { UserEntity } from "@/api";
import { getAllUsersOptions } from "@/api/@tanstack/react-query.gen";
import { userColumn } from "@/ui/molecules/columns/userColumn";
import { DataTable } from "@/ui/organisms/table/DataTable";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const UserList = () => {
  const {
    data: users,
    isLoading: isUserLoading,
    refetch,
    error,
  } = useQuery({
    ...getAllUsersOptions(),
  });

  console.log("users list", users);

  return (
    <div className="space-y-4">
      {isUserLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          Error: {error.message}
          <span>Retry</span>
          <button onClick={() => refetch()}>Retry Now</button>
        </div>
      )}

      {!isUserLoading && !error && (
        <DataTable
          data={(users?.data?.data as UserEntity[]) || []}
          columns={userColumn}
        />
      )}
    </div>
  );
};

export default UserList;
