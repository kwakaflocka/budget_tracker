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
import { ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product";
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
import { CreateProduct } from "@/app/(dashboard)/_actions/new-products";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
  trigger: ReactNode;
  type: ProductType;
}

function ImportProductDialog({ trigger, type }: Props) {
  const form = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
   
      date: new Date(),
    },
  });
  const [open, setOpen] = useState(false);
  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const handleStrainChange = useCallback(
    (value: string) => {
      form.setValue("strain", value);
    },
    [form]
  );

  const handleGrowerChange = useCallback(
    (value: string) => {
      form.setValue("grower", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateProduct,
    onSuccess: () => {
      toast.success("Product imported successfully 🎉", {
        id: "import-product",
      });

      form.reset({
        product: "",
        quantity: 0,
        createdAt: new Date(),
        category: undefined,
        grower: undefined,
        strain: undefined
      });

      // After importing a product, we need to invalidate the overview query which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (values: CreateProductSchemaType) => {
      toast.loading("Importing product...", { id: "import-product" });

      mutate({
        ...values,
        createdAt: DateToUTCDate(values.createdAt),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Product Import</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Product name (required)</FormDescription>
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>Product amount (required)</FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Import date</FormLabel>
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
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
            </div>
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="strain"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Strain</FormLabel>
                    <FormControl>
                      <StrainPicker type={type} onChange={handleStrainChange} />
                    </FormControl>
                    <FormDescription>Select a strain for this product</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grower"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Grower</FormLabel>
                    <FormControl>
                      <GrowerPicker type={type} onChange={handleGrowerChange} />
                    </FormControl>
                    <FormDescription>Select a grower for this product</FormDescription>
                  </FormItem>
                )}
              />
            </div>
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
            {!isPending && "Import"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportProductDialog;