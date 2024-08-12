import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { grower } from "@prisma/client";

import { Grower, TransactionType } from "@/lib/types";

type DeleteGrowerDialogProps = {
  grower: Grower;
  trigger: React.ReactNode;
};

function DeleteGrowerDialog({ grower, trigger }: DeleteGrowerDialogProps) {
  const router = useRouter();
  const growerIdentifier = `delete-grower-${grower.id}`;

  const deleteMutation = useMutation({
    mutationKey: growerIdentifier,
    mutationFn: (data: DeleteGrowerSchemaType) =>
      grower.delete({
        where: {
          name_userId_type: {
            userId: grower.userId,
            name: data.name,
            type: data.type,
          },
        },
      }),
    onSuccess: () => {
      toast.success(`Deleted ${grower.name}`, {
        id: growerIdentifier,
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: growerIdentifier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            grower
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting grower...", {
                id: growerIdentifier,
              });
              deleteMutation.mutate({
                name: grower.name,
                type: grower.type as TransactionType,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteGrowerDialog;