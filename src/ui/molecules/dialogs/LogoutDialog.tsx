import { logoutMutation } from "@/api/@tanstack/react-query.gen";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/ui/shadcn/alert-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const LogoutDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    ...logoutMutation(),
  });
  const queryClient = useQueryClient();
  const handleLogoutClick = () => {
    logout(
      {},
      {
        onSuccess: (response) => {
          localStorage.clear();
          queryClient.clear();
          sessionStorage.clear();
          window.location.href = "/auth/login";
          toast.success(response.message || "Logged out successfully");
        },
        onError: () => {
          toast.error("Logout failed");
          queryClient.clear();
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/auth/login";
        },
      },
    );
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will logout you from the application. The current session
              will be terminated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleLogoutClick}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutDialog;
