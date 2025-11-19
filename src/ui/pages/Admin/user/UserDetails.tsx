import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/tabs";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/shadcn/table";
import { UserEntity } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { revokeUserSessionMutation } from "@/api/@tanstack/react-query.gen";
import { toast } from "sonner";

interface UserDetailsDialogProps {
  user: UserEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockSessions = [
  {
    id: "1",
    device: "Chrome on MacOS",
    ip: "192.168.1.105",
    loginTime: "2025-01-17 14:32",
    expiresAt: "2025-01-24 14:32",
  },
  {
    id: "2",
    device: "Safari on iPhone",
    ip: "172.16.0.45",
    loginTime: "2025-01-16 09:15",
    expiresAt: "2025-01-23 09:15",
  },
  {
    id: "3",
    device: "Firefox on Windows",
    ip: "10.0.0.88",
    loginTime: "2025-01-14 18:45",
    expiresAt: "2025-01-21 18:45",
  },
];

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) return null;
  console.log("Rendering UserDetailsDialog for user:", user);
  const { mutate: revokeSession, isPending: isSessionRevoking } = useMutation({
    ...revokeUserSessionMutation(),
  });

  const handleForceLogoutClick = () => {
    revokeSession(
      { body: { userId: user.id } },
      {
        onSuccess: (response) => {
          toast.success(
            response.message || "User session revoked successfully"
          );
        },
        onError: (error: any) => {
          toast.error(
            error?.message || "Failed to revoke user session. Please try again."
          );
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security Info</TabsTrigger>
            <TabsTrigger value="sessions">Active Session</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Full Name
                    </div>
                    <div className="font-bold">{user.fullName}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-bold">{user.email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-bold">{user.email || "N/A"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Member Since
                    </div>
                    <div className="font-bold">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Last Login
                    </div>
                    <div className="font-bold">
                      {user?.deviceInfo?.updatedAt
                        ? new Date(user.deviceInfo.updatedAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Last Login Details
                    </div>
                    <div className="font-bold">
                      {user.deviceInfo?.location
                        ? (() => {
                            try {
                              const location = JSON.parse(
                                user.deviceInfo.location || "{}"
                              );
                              return (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {location.city}, {location.region}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {location.country}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    IP: {location.ip} • {location.org}
                                  </div>
                                </div>
                              );
                            } catch (e) {
                              return "Invalid location data";
                            }
                          })()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="mt-6">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header with Force Logout All Button */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mockSessions.length} active session(s) detected
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleForceLogoutClick}
                      disabled={isSessionRevoking}
                      className="gap-2"
                    >
                      {isSessionRevoking ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Revoking...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                          </svg>
                          Force Logout All Sessions
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Sessions Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Device</TableHead>
                        <TableHead className="font-medium">
                          IP Address
                        </TableHead>
                        <TableHead className="font-medium">
                          Login Time
                        </TableHead>
                        <TableHead className="font-medium">
                          Expires At
                        </TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSessions.length > 0 ? (
                        mockSessions.map((session, index) => (
                          <TableRow
                            key={session.id}
                            className={index % 2 === 1 ? "bg-muted/50" : ""}
                          >
                            <TableCell className="text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                {session.device}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {session.ip}
                            </TableCell>
                            <TableCell className="text-sm">
                              {session.loginTime}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {session.expiresAt}
                            </TableCell>
                            <TableCell className="text-sm">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Active
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No active sessions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Warning Message */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-600 mt-0.5 flex-shrink-0"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <line x1="12" x2="12" y1="9" y2="13" />
                      <line x1="12" x2="12.01" y1="17" y2="17" />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-900">
                        Force logout will immediately revoke all active sessions
                      </p>
                      <p className="text-xs text-amber-700">
                        The user will be logged out from all devices and will
                        need to login again to access their account.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
