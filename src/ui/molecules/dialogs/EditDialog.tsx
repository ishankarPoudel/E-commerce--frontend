import { updateUserByIdMutation } from "@/api/@tanstack/react-query.gen";
import { AlertDialogFooter } from "@/ui/shadcn/alert-dialog";
import { Button } from "@/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/dialog";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { getClientInfo } from "@/utils/getClientInfo";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { toast } from "sonner";

export const EditDialog = ({
  open,
  setOpen,
  userInfo,
}: {
  open: boolean;
  userInfo: any;
  setOpen: (open: boolean) => void;
}) => {
  const { mutate: updateUser, isPending } = useMutation({
    ...updateUserByIdMutation(),
  });
  const [_, setLocation] = useState<string | null>(null);
  useEffect(() => {
    const fetchLocation = async () => {
      const clientInfo = await getClientInfo();
      setLocation(
        clientInfo.location ? JSON.stringify(clientInfo.location) : "Unknown"
      );
    };
    fetchLocation();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const fullName = String(fd.get("name") ?? "").trim();
            if (!fullName) {
              toast.error("Name is required");
              return;
            }
            try {
              const res = await updateUser(
                {
                  body: { fullName },
                },
                {
                  onSuccess: (response) => {
                    toast.success(
                      response.message || "Profile updated successfully"
                    );
                  },
                  onError: () => {
                    toast.error("Failed to update profile");
                  },
                }
              );
              setOpen(false);
            } catch (err: any) {
              toast.error(err?.message || "Failed to update profile");
            }
          }}
          className="grid gap-4"
        >
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              onFocus={(e) => e.target.select()}
              id="name"
              name="name"
              defaultValue={userInfo?.fullName || ""}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              disabled
              defaultValue={userInfo?.email || ""}
            />
            <p className="text-xs text-muted-foreground">
              For security reasons, email cannot be changed.
            </p>
          </div>

          <AlertDialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </AlertDialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
