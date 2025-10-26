import { Store, Truck, MapPin, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/ui/shadcn/card";

type DeliveryMethod = "delivery" | "pickup";

interface DeliveryMethodSelectorProps {
  selectedMethod: DeliveryMethod;
  onMethodChange: (method: DeliveryMethod) => void;
}

export function DeliveryMethodSelector({
  selectedMethod,
  onMethodChange,
}: DeliveryMethodSelectorProps) {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-playfair font-semibold text-card-foreground'>
        Delivery Method
      </h2>

      <div className='grid md:grid-cols-2 gap-4'>
        {/* Home Delivery Option */}
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedMethod === "delivery"
              ? "ring-2 ring-primary shadow-md"
              : "hover:border-primary/50"
          )}
          onClick={() => onMethodChange("delivery")}>
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  selectedMethod === "delivery"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                <Truck className='h-6 w-6' />
              </div>

              <div className='flex-1 space-y-2'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-lg text-card-foreground'>
                    Home Delivery
                  </h3>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedMethod === "delivery"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                    {selectedMethod === "delivery" && (
                      <div className='w-2.5 h-2.5 rounded-full bg-primary-foreground' />
                    )}
                  </div>
                </div>

                <p className='text-sm text-muted-foreground'>
                  Get your bags delivered to your doorstep
                </p>

                <div className='flex items-center gap-2 text-sm'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span className='text-muted-foreground'>
                    3-5 business days
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Pickup Option */}
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedMethod === "pickup"
              ? "ring-2 ring-primary shadow-md"
              : "hover:border-primary/50"
          )}
          onClick={() => onMethodChange("pickup")}>
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  selectedMethod === "pickup"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                <Store className='h-6 w-6' />
              </div>

              <div className='flex-1 space-y-2'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-lg text-card-foreground'>
                    Store Pickup
                  </h3>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedMethod === "pickup"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                    {selectedMethod === "pickup" && (
                      <div className='w-2.5 h-2.5 rounded-full bg-primary-foreground' />
                    )}
                  </div>
                </div>

                <p className='text-sm text-muted-foreground'>
                  Pick up your order at our store
                </p>

                <div className='flex items-center gap-2 text-sm'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span className='text-muted-foreground'>
                    Ready in 2-3 hours
                  </span>
                </div>

                {selectedMethod === "pickup" && (
                  <div className='mt-3 pt-3 border-t border-border'>
                    <div className='flex items-start gap-2 text-sm'>
                      <MapPin className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='font-medium text-card-foreground'>
                          Avisekh Bag Pashal
                        </p>
                        <p className='text-muted-foreground'>
                          Kantipur Mall, Floor 4, unit 432, 431
                        </p>
                        <p className='text-muted-foreground'>
                          New Buspark, Kathmandu, Nepal
                        </p>
                        <p className='text-muted-foreground mt-1'>
                          Sun-Sat: 10AM - 10PM
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMethod === "pickup" && (
        <div className='bg-accent/50 border border-border rounded-lg p-4'>
          <div className='flex gap-3'>
            <Store className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
            <div className='space-y-1'>
              <p className='font-medium text-sm text-card-foreground'>
                Free Store Pickup
              </p>
              <p className='text-sm font-semibold text-primary bg-primary/10 rounded px-3 py-2 border border-primary/30'>
                We'll send you an email when your order is ready for pickup. You
                need to pay when you come to pick it up. Order confirmation need
                to be shown at the store.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
