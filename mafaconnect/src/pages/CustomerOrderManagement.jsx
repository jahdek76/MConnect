import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/transactionUtils";
import { format } from "date-fns";
import { Search, Eye, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE_VARIANT = {
  pending: "outline",
  confirmed: "secondary",
  processing: "secondary",
  packed: "default",
  shipped: "default",
  out_for_delivery: "default",
  delivered: "default",
  cancelled: "destructive",
};

export default function CustomerOrderManagement() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");

  // ✅ Fetch orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("customer_orders")
        .select("*, items(id, quantity, product_name)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredOrders = orders?.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contact_phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Payment confirmation
  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;

    setIsConfirmingPayment(true);
    try {
      const { error } = await supabase.functions.invoke("confirm-payment", {
        body: {
          order_id: selectedOrder.id,
          payment_reference: paymentReference,
        },
      });

      if (error) throw error;

      toast({
        title: "Payment Confirmed",
        description: "Payment successfully recorded.",
      });

      setPaymentReference("");
      refetch();
    } catch (err) {
      toast({
        title: "Error Confirming Payment",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // ✅ Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke("update-order-status", {
        body: {
          order_id: selectedOrder.id,
          new_status: newStatus,
          notes: statusNotes,
        },
      });

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: "Status successfully updated.",
      });

      setIsDialogOpen(false);
      setNewStatus("");
      setStatusNotes("");
      refetch();
    } catch (err) {
      toast({
        title: "Error Updating Status",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const needsPaymentConfirmation = (order) =>
    order.payment_status === "pending" &&
    ["bank_transfer", "cash_on_delivery", "pay_on_pickup"].includes(order.payment_method);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Customer Order Management</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders from all channels
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Orders", count: orders?.length || 0 },
          {
            title: "Pending",
            count: orders?.filter((o) => o.status === "pending").length || 0,
          },
          {
            title: "To Ship",
            count:
              orders?.filter((o) =>
                ["confirmed", "processing", "packed"].includes(o.status)
              ).length || 0,
          },
          {
            title: "Delivered Today",
            count:
              orders?.filter(
                (o) =>
                  o.status === "delivered" &&
                  format(new Date(o.updated_at), "yyyy-MM-dd") ===
                    format(new Date(), "yyyy-MM-dd")
              ).length || 0,
          },
        ].map((card, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number or customer phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading orders...</div>
          ) : filteredOrders?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.contact_phone}</p>
                        {order.contact_email && (
                          <p className="text-sm text-muted-foreground">
                            {order.contact_email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(order.created_at), "PP")}</TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell>
                      {needsPaymentConfirmation(order) ? (
                        <Badge variant="outline" className="border-warning text-warning">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-success">
                          Paid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_BADGE_VARIANT[order.status] || "secondary"}
                      >
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No results found. Try adjusting filters."
                : "Customer orders will appear here."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Managing Orders */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {needsPaymentConfirmation(selectedOrder) && (
                <Alert className="border-warning bg-warning/10">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertDescription>
                    This order requires payment confirmation.
                  </AlertDescription>
                </Alert>
              )}

              {/* Confirm Payment */}
              {needsPaymentConfirmation(selectedOrder) && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <Label htmlFor="payment-reference">
                    Payment Reference (Optional)
                  </Label>
                  <Input
                    id="payment-reference"
                    placeholder="Enter payment reference or transaction ID..."
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                  />
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={isConfirmingPayment}
                    className="w-full"
                  >
                    {isConfirmingPayment ? "Processing..." : "Confirm Payment"}
                  </Button>
                </div>
              )}

              {/* Update Status */}
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.filter((s) => s.value !== "all").map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about the status update..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                />
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === selectedOrder.status}
                className="w-full"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
