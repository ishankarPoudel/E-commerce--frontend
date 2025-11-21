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

import { UserEntity } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { revokeUserSessionMutation } from "@/api/@tanstack/react-query.gen";
import { toast } from "sonner";

interface UserDetailsDialogProps {
  user: UserEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
                <div className="space-y-6">
                  {/* Header with Force Logout Button */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Current Active Session
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Most recent login information for this user
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
                          Force Logout
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Session Information Card */}
                  {user.deviceInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Device Information */}
                      <Card className="border-2">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-muted-foreground">
                                DEVICE INFORMATION
                              </h4>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5" />
                                Active
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground mt-0.5"
                                >
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="M6 8h.01" />
                                  <path d="M10 8h.01" />
                                  <path d="M14 8h.01" />
                                </svg>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Device Type
                                  </p>
                                  <p className="font-semibold">
                                    {user.deviceInfo.device || "Unknown"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground mt-0.5"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <circle cx="12" cy="12" r="4" />
                                  <line x1="21.17" x2="12" y1="8" y2="8" />
                                  <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                                  <line
                                    x1="10.88"
                                    x2="15.46"
                                    y1="21.94"
                                    y2="14"
                                  />
                                </svg>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Browser
                                  </p>
                                  <p className="font-semibold">
                                    {user.deviceInfo.browser || "Unknown"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground mt-0.5"
                                >
                                  <rect
                                    width="7"
                                    height="9"
                                    x="3"
                                    y="3"
                                    rx="1"
                                  />
                                  <rect
                                    width="7"
                                    height="5"
                                    x="14"
                                    y="3"
                                    rx="1"
                                  />
                                  <rect
                                    width="7"
                                    height="9"
                                    x="14"
                                    y="12"
                                    rx="1"
                                  />
                                  <rect
                                    width="7"
                                    height="5"
                                    x="3"
                                    y="16"
                                    rx="1"
                                  />
                                </svg>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Operating System
                                  </p>
                                  <p className="font-semibold">
                                    {user.deviceInfo.os || "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Location & Time Information */}
                      <Card className="border-2">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground">
                              LOCATION & TIME
                            </h4>

                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground mt-0.5"
                                >
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground">
                                    Location
                                  </p>
                                  {user.deviceInfo.location &&
                                  user.deviceInfo.location !== "{}" ? (
                                    (() => {
                                      try {
                                        const location = JSON.parse(
                                          user.deviceInfo.location
                                        );

                                        // Handle error/fail status from IP-API
                                        if (
                                          location.status === "fail" ||
                                          location.error
                                        ) {
                                          return (
                                            <div className="space-y-1">
                                              <p className="font-semibold text-amber-600">
                                                {location.city ||
                                                  "Local Development"}
                                              </p>
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                {location.country || "Local"}
                                              </Badge>
                                              {location.ip && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  IP: {location.ip}
                                                </p>
                                              )}
                                            </div>
                                          );
                                        }

                                        // Normal location display
                                        return (
                                          <div className="space-y-1">
                                            <p className="font-semibold">
                                              {location.city || "Unknown"},{" "}
                                              {location.region || "Unknown"}
                                            </p>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                {location.country || "Unknown"}
                                              </Badge>
                                            </div>
                                            {location.ip && (
                                              <p className="text-xs text-muted-foreground mt-1">
                                                IP: {location.ip}
                                              </p>
                                            )}
                                            {location.org && (
                                              <p className="text-xs text-muted-foreground">
                                                {location.org}
                                              </p>
                                            )}
                                          </div>
                                        );
                                      } catch (e) {
                                        return (
                                          <p className="font-semibold text-muted-foreground">
                                            Unable to parse location
                                          </p>
                                        );
                                      }
                                    })()
                                  ) : (
                                    <p className="font-semibold text-muted-foreground">
                                      Location not available
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground mt-0.5"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Last Login
                                  </p>
                                  <p className="font-semibold">
                                    {new Date(
                                      user.deviceInfo.updatedAt
                                    ).toLocaleString("en-US", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {(() => {
                                      const now = new Date();
                                      const loginTime = new Date(
                                        user.deviceInfo.updatedAt
                                      );
                                      const diffMs =
                                        now.getTime() - loginTime.getTime();
                                      const diffMins = Math.floor(
                                        diffMs / 60000
                                      );
                                      const diffHours = Math.floor(
                                        diffMins / 60
                                      );
                                      const diffDays = Math.floor(
                                        diffHours / 24
                                      );

                                      if (diffMins < 1) return "Just now";
                                      if (diffMins < 60)
                                        return `${diffMins} minutes ago`;
                                      if (diffHours < 24)
                                        return `${diffHours} hours ago`;
                                      return `${diffDays} days ago`;
                                    })()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-muted-foreground mt-0.5"
                                >
                                  <path d="M8 2v4" />
                                  <path d="M16 2v4" />
                                  <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="M3 10h18" />
                                </svg>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Session Created
                                  </p>
                                  <p className="font-semibold">
                                    {new Date(
                                      user.deviceInfo.createdAt
                                    ).toLocaleString("en-US", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto text-muted-foreground mb-4"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-1">
                        No Active Session
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This user has not logged in yet or their session has
                        expired.
                      </p>
                    </div>
                  )}

                  {/* Warning Message */}
                  {user.deviceInfo && (
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
                          Force logout will immediately revoke the current
                          session
                        </p>
                        <p className="text-xs text-amber-700">
                          The user will be logged out and will need to login
                          again to access their account.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
