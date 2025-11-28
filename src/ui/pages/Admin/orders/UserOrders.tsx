import { OrderEntity, UserEntity } from "@/api";
import { OrdersTableView } from "./OrdersTableView";

type Props = {
  orders?: OrderEntity[];
  user?: UserEntity;
};

const UserOrders = ({ orders, user }: Props) => {
  const displayUser = user ?? orders?.[0]?.user;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Order Management
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Manage and monitor all orders placed by{" "}
                  <span className="font-medium">
                    {displayUser?.fullName || "User"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrdersTableView orders={orders || []} />
    </div>
  );
};

export default UserOrders;
