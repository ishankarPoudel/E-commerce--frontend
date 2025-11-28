import React from "react";
import { OrderEntity } from "@/api";
import { orderColumn } from "@/ui/molecules/columns/orderColumn";
import { DataTable } from "@/ui/organisms/table/DataTable";

import { PaginationState, OnChangeFn } from "@tanstack/react-table";
import { OrderDetails } from "./OrderDetails";
import { UpdateOrderStatus } from "./OrderStatusUpdate";

type NavigateFn = (opts: {
  to: string;
  params?: Record<string, unknown>;
  search?: Record<string, unknown>;
}) => void;

type OrdersTableViewProps = {
  orders: OrderEntity[];
  navigate?: NavigateFn;
  toolbar?: React.ReactNode;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
};

export function OrdersTableView({
  orders,
  navigate,
  toolbar,
  pagination,
  onPaginationChange,
  pageCount,
}: OrdersTableViewProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<OrderEntity | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);

  const handleViewDetails = (order: OrderEntity) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleOrderStatusUpdate = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId) || null;
    setSelectedOrder(found);
    setIsStatusOpen(true);
  };

  return (
    <div className="w-full">
      {toolbar}
      <DataTable
        columns={orderColumn(
          handleViewDetails,
          handleOrderStatusUpdate,
          navigate
        )}
        data={orders}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
      />

      {selectedOrder && (
        <>
          <OrderDetails
            order={selectedOrder}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <UpdateOrderStatus
            open={isStatusOpen}
            onOpenChange={setIsStatusOpen}
            orderId={selectedOrder.id}
            currentStatus={selectedOrder.orderStatus as any}
          />
        </>
      )}
    </div>
  );
}
