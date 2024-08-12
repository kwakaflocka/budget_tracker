import { z } from "zod";

// Define the schema for creating a transaction
export const CreateTransactionSchema = z.object({
  type: z.string(),
  date: z.date(),
  description: z.string().optional(),
  amount: z.number(),
  strain: z.string().optional(),
  grower: z.string().optional(), // Add this line
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;

// Define the type for strainRow and growerRow
type StrainRow = {
  id: string;
  createdAt: Date;
  name: string;
  userId: string;
  icon: string;
  type: string;
};

type GrowerRow = {
  id: string;
  createdAt: Date;
  name: string;
  userId: string;
  icon: string;
  type: string;
};

// Example function where the error occurs
const createTransaction = (strainRow: StrainRow, growerRow: GrowerRow, amount: number, date: Date, description: string) => {
  return {
    data: {
      amount,
      strainId: strainRow.id,
      growerId: growerRow.id,
      date,
      description,
    },
  };
};