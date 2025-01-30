import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bevCategories } from "../categories/bevCategories";
import { capitalizeFirstLetter } from "../functions/functions";
import usePostBev from "../hooks/usePostBev";
import usePutEvent from "../hooks/usePutEvent";
import { EventDocumentType } from "../interfaces/interfaces";
import { nanoid } from "nanoid";

const bevSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(2, { message: "Enter at least 2 characters" })
    .max(50),
  category: z.enum(bevCategories, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  name: z
    .string()
    .trim()
    .min(0, { message: "Enter at least 2 characters" })
    .max(50)
    .optional(),
  amount: z.number({ invalid_type_error: "Amount is required" }).min(1).max(99),
});

export type BevFormData = z.infer<typeof bevSchema>;

interface Props {
  selectedEvent: EventDocumentType;
  // onSubmit: (data: BevFormData) => void;
}

const BevForm = ({ selectedEvent }: Props) => {
  // returns object
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<BevFormData>({
    resolver: zodResolver(bevSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: postBevMutateAsync } = usePostBev();

  // put Event
  const { mutateAsync: putEventMutateAsync } = usePutEvent(selectedEvent);

  return (
    <form
      // handleSubmit from react hook form
      onSubmit={handleSubmit(async (newBevFormData) => {
        const publicId = nanoid();

        const newBevWithPublicId = {
          ...newBevFormData,
          publicId: publicId,
        };

        const resultBevFromMutate = await postBevMutateAsync(
          newBevWithPublicId
        );

        console.log(resultBevFromMutate);

        // adding Bev to event

        if (resultBevFromMutate === undefined)
          throw new Error("resultBev is undefined");

        const resultBevId = resultBevFromMutate._id?.toString();

        if (resultBevId === undefined)
          throw new Error("resultBevId is undefined");
        if (selectedEvent.bevs === undefined)
          throw new Error("selectedEvent.bevs is undefined");

        // add newBev id to selectedEvent
        selectedEvent.publicId !== "none"
          ? selectedEvent.bevs.push(resultBevId)
          : new Error("no event selected");

        const selectedEventWithoutId = { ...selectedEvent };
        delete selectedEventWithoutId._id;

        const resultEventFromMutate = await putEventMutateAsync(
          selectedEventWithoutId
        );

        console.log(resultEventFromMutate);

        reset();
      })}
    >
      <div className="mb-3">
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

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        {/* // hook form register function, spread result, copy all previous values */}
        <select {...register("category")} id="category" className="form-select">
          <option value="Select">Select Beverage Category</option>
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

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Beverage Name (optional)
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="form-control"
        />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
      </div>

      <div className="mb-3">
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

      {/* Submit */}
      <button disabled={!isValid} className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default BevForm;
