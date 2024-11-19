import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { bevCategories, bevCategoriesEnum } from "../categories/bevCategories";
import { capitalizeFirstLetter } from "../functions/functions";
import usePutBev from "../hooks/usePutBev";
import { BevDocumentType } from "../interfaces/interfaces";
import { Fade } from "@mui/material";

const bevSchema = z.object({
  userName: z
    .string()
    .min(2, { message: "Enter at least 2 characters" })
    .max(50),
  category: z.enum(bevCategories, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  name: z
    .string()
    .min(0, { message: "Enter at least 2 characters" })
    .max(50)
    .optional(),
  amount: z.number({ invalid_type_error: "Amount is required" }).min(1).max(99),
});

export type EditBevFormData = z.infer<typeof bevSchema>;

interface Props {
  bev: BevDocumentType;
  editItemDisplay: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditBevForm = ({ bev, editItemDisplay, onSubmit, onCancel }: Props) => {
  // returns object
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EditBevFormData>({
    resolver: zodResolver(bevSchema),
    defaultValues: {
      userName: bev.userName,
      category: bev.category as bevCategoriesEnum,
      name: bev.name,
      amount: bev.amount,
    },
  });

  const {
    data: putBevData,
    error: putBevError,
    isError: putBevIsError,
    isPending: putBevIsPending,
    isSuccess: putBevIsSuccess,
    mutate: putBevMutate,
    mutateAsync: putBevMutateAsync,
    reset: putBevReset,
    status: putBevStatus,
  } = usePutBev();

  return (
    <Fade in={editItemDisplay}>
      <form
        // handleSubmit from react hook form
        onSubmit={handleSubmit(async (editBevFormData) => {
          if (bev._id === undefined) throw new Error("bev._id is undefined");

          const bevWithPublicId = {
            ...editBevFormData,
            publicId: bev.publicId,
          };

          const result = await putBevMutateAsync({
            itemId: bev._id.toString(),
            data: bevWithPublicId,
          });

          console.log(result);

          onSubmit();

          reset();
        })}
      >
        <div className="row bg-info-subtle" key={bev._id?.toString()}>
          <div className="col-xs col-lg-3 p-2 border border-primary-subtle">
            <label htmlFor="userName" className="form-label">
              Your Name
            </label>
            <input
              {...register("userName")}
              id="userName"
              type="text"
              className="form-control"
            />
            {errors.userName && (
              <p className="text-danger">{errors.userName.message}</p>
            )}
          </div>

          <div className="col-xs col-lg p-2 border border-primary-subtle">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            {/* // hook form register function, spread result, copy all previous values */}
            <select
              {...register("category")}
              id="category"
              className="form-select"
            >
              <option value="Select">Select Beverage</option>
              {bevCategories.map((category) => (
                <option key={category} value={category}>
                  {capitalizeFirstLetter(category)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-danger">{errors.category.message}</p>
            )}
          </div>

          <div className="col-xs col-lg p-2 border border-primary-subtle">
            <label htmlFor="name" className="form-label">
              Beverage Name (optional)
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              className="form-control"
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="col-xs col-lg p-2 border border-primary-subtle">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              {...register("amount", { valueAsNumber: true })}
              id="amount"
              type="number"
              className="form-control"
            />
            {errors.amount && (
              <p className="text-danger">{errors.amount.message}</p>
            )}
          </div>

          <div className="col-xs col-lg p-2 border border-primary-subtle">
            <button
              className="btn btn-light btn-sm me-2"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>

            <button
              disabled={!isValid}
              className="btn btn-primary btn-sm"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Fade>
  );
};

export default EditBevForm;
