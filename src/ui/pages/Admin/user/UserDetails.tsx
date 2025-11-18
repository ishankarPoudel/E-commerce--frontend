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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Device</TableHead>
                      <TableHead className="font-medium">IP</TableHead>
                      <TableHead className="font-medium">Login Time</TableHead>
                      <TableHead className="font-medium">Expires At</TableHead>
                      <TableHead className="font-medium text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.map((session, index) => (
                      <TableRow
                        key={session.id}
                        className={index % 2 === 1 ? "bg-muted/50" : ""}
                      >
                        <TableCell className="text-sm font-medium">
                          {session.device}
                        </TableCell>
                        <TableCell className="text-sm">{session.ip}</TableCell>
                        <TableCell className="text-sm">
                          {session.loginTime}
                        </TableCell>
                        <TableCell className="text-sm">
                          {session.expiresAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm">
                            Force Logout
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
