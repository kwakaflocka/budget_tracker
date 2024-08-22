"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { ReactNode, useCallback, useState } from "react";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ProductPicker from "@/app/(dashboard)/_components/ProductPicker";

import StrainPicker from "@/app/(dashboard)/_components/StrainPicker";
import GrowerPicker from "@/app/(dashboard)/_components/GrowerPicker";
import CategoryPicker from "@/app/(dashboard)/_components/CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "@/app/(dashboard)/_actions/transactions";
import { CreateProduct } from "@/app/(dashboard)/_actions/new-products";

import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";
import CreateProductDialog from './CreateProductDialog';
import { useQuery } from "@tanstack/react-query";
interface Props {
  trigger: ReactNode;
  type: TransactionType;
}
async function fetchUserSettings() {
  const res = await fetch("/api/user-settings"); // Call your API route
  if (!res.ok) throw new Error("Failed to fetch user settings");
  return res.json();
}
function CreateTransactionDialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });
  const [open, setOpen] = useState(false);
  
  const { data: userSettings, isLoading } = useQuery({
    queryKey: ["userSettings"],    // Query key
    queryFn: fetchUserSettings,    // Query function
  });

  const handleProductChange = useCallback(
    (value: string) => {
      form.setValue("product", value);
    },
    [form]
  );
  // const handleStrainChange = useCallback(
  //   (value: string) => {
  //     form.setValue("product.strain", value);
  //   },
  //   [form]
  // );
  // const handleGrowerChange = useCallback(
  //   (value: string) => {
  //     form.setValue("product.grower", value);
  //   },
  //   [form]
  // );
  // const handleCategoryChange = useCallback(
  //   (value: string) => {
  //     form.setValue("product.category", value);
  //   },
  //   [form]
  // );
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully 🎉", {
        id: "create-transaction",
      });

      form.reset({
        product: '',
        type,
        description: "",
        amount: 0,
        date: new Date(),
        // strain: undefined,
        // grower: undefined,
        // category: undefined
      });

      // After creating a transaction, we need to invalidate the overview query which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Creating transaction...", { id: "create-transaction" });

      mutate({
        ...values,
        date: DateToUTCDate(values.date),
      });
    },
    [mutate]
  );
// If loading user settings, show a loading state (optional)
if (isLoading) {
  return <div>Loading user settings...</div>;
}

// Destructure the weight unit from userSettings
const weightUnit = userSettings?.weight || "g";  // Default to grams if not available

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "order" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            /> */}

<FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <ProductPicker
                      
                        onChange={handleProductChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a product for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount in {weightUnit} (required)
                  </FormDescription>
                </FormItem>
              )}
            />
                        <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                  <Input
          {...field}   // Spread field but override `value` within it
          value={field.value ?? ""}  // Coerce `null` to an empty string
        />
          </FormControl>
                  <FormDescription>
                    Product 
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="grower"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Grower</FormLabel>
                    <FormControl>
                      <GrowerPicker
                        type={type}
                        onChange={handleGrowerChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a grower for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="strain"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Strain</FormLabel>
                    <FormControl>
                      <StrainPicker
                        type={type}
                        onChange={handleStrainChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a strain for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select a date for this</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;