"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import StrainPicker from "@/app/(dashboard)/_components/StrainPicker";
import GrowerPicker from "@/app/(dashboard)/_components/GrowerPicker";
import ProductPicker from "@/app/(dashboard)/_components/ProductPicker";
import CategoryPicker from "@/app/(dashboard)/_components/CategoryPicker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import React, { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProduct } from "@/app/(dashboard)/_actions/new-products";
import { Product } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { orderColumns } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

interface Props {
  trigger: ReactNode;
  successCallback: (product: Product) => void;
}

async function fetchUserSettings() {
  const res = await fetch("/api/user-settings"); // Call your API route
  if (!res.ok) throw new Error("Failed to fetch user settings");
  return res.json();
}
function CreateProductDialog({ trigger, successCallback }: Props) {
 
  const form = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      createdAt: new Date(),
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
  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateProduct,
    onSuccess: async (data: Product) => {
    form.reset({
        product: "",
        icon: "",
        strain: undefined,
        grower: undefined,
        category: undefined
      });

      toast.success(`Product ${data.product} created successfully 🎉`, {
        id: "create-product",
      });


      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "create-product",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateProductSchemaType) => {
      toast.loading("Creating product...", {
        id: "create-product",
      });
      mutate(values);
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
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={"ghost"}
            className="flex border-separate items-center justify-start roudned-none border-b px-3 py-3 text-muted-foreground"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                "m-1",
                 "text-emerald-500" 
              )}
            >
            </span>
            new Product
          </DialogTitle>
          <DialogDescription>
            Name a new Product and assign a Grower, Strain, and Category
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your product will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                  <Input
          {...field}
          value={field.value ?? 0} // Ensure default value is 0
          type="number"
          placeholder="Enter product quantity"
        />

            </FormControl>
                  <FormDescription>
                  Quantity in {weightUnit} (e.g., 100 {weightUnit})
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your product will appear in the app
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
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this Product
                    </FormDescription>
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
                      <GrowerPicker
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
                name="strain"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Strain</FormLabel>
                    <FormControl>
                      <StrainPicker
                      
                        onChange={handleStrainChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a strain for this Product
                    </FormDescription>
                  </FormItem>
                )}
              />
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

export default CreateProductDialog;
