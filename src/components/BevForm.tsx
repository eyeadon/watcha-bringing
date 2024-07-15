import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import bevCategories from "../bevCategories";

const bevSchema = z.object({
  category: z.enum(bevCategories, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  name: z.string().min(3, { message: "Enter at leats 3 characters" }).max(50),
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .min(0)
    .max(999),
});

export type BevFormData = z.infer<typeof bevSchema>;

interface Props {
  onSubmit: (data: BevFormData) => void;
}

const BevForm = ({ onSubmit }: Props) => {
  // returns object
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<BevFormData>({ resolver: zodResolver(bevSchema) });

  return (
    <form
      // handleSubmit from react hook form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
    >
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        {/* // hook form register function, spread result, copy all previous values */}
        <select {...register("category")} id="category" className="form-select">
          <option value="Select">Select Beverage</option>
          {bevCategories.map((category) => (
            <option key={category} value={category}>
              {category}
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
