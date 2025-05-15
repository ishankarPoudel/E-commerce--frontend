import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/ui/shadcn/alert-dialog";

const DeleteDialog = ({
  deleteTitle,
  deleteDescription,
  handleDeleteClick,
  isDeleting,
  open,
  setOpen,
}: {
  deleteTitle: string;
  deleteDescription: string;
  handleDeleteClick: () => void;
  isDeleting: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteClick}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
