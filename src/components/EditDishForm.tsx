import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dishCategories from "../categories/dishCategories";
import dietaryConsiderations from "../categories/dietaryConsiderations";
import { capitalizeFirstLetter } from "../functions/functions";
import usePutDish from "../hooks/usePutDish";
import { DishDocumentType } from "../interfaces/interfaces";

const dishSchema = z.object({
  category: z.enum(dishCategories, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  name: z.string().min(2, { message: "Enter at least 2 characters" }).max(50),
  amount: z.number({ invalid_type_error: "Amount is required" }).min(1).max(99),
  dietary: z.enum(dietaryConsiderations).array().optional(),
});

export type DishFormData = z.infer<typeof dishSchema>;

interface Props {
  dish: DishDocumentType;
  // onSubmit: (data: DishFormData) => void;
}

const DishForm = ({ dish }: Props) => {
  // returns object
  const {
    register,
    // trigger,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      dietary: [],
    },
  });

  const {
    data: putDishData,
    error: putDishError,
    isError: putDishIsError,
    isPending: putDishIsPending,
    isSuccess: putDishIsSuccess,
    mutate: putDishMutate,
    mutateAsync: putDishMutateAsync,
    reset: putDishReset,
    status: putDishStatus,
  } = usePutDish();

  return (
    <form
      // handleSubmit from react hook form, this function will receive the form data if form validation is successful
      // data is ready to send to the server
      onSubmit={handleSubmit(async (dishFormData) => {
        if (dish._id === undefined) throw new Error("dish._id is undefined");

        const dishWithPublicId = {
          ...dishFormData,
          publicId: dish.publicId,
        };

        const result = await putDishMutateAsync({
          itemId: dish._id.toString(),
          data: dishWithPublicId,
        });

        console.log(result);

        reset();
      })}
    >
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        {/* // hook form register function, spread result, copy all previous values */}
        <select {...register("category")} id="category" className="form-select">
          <option value="Select">Select Dish</option>
          {dishCategories.map((category) => (
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
          Dish Name
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

      <div className="mb-3">
        <label className="form-label">
          Dietary Considerations Included (optional)
        </label>
        {dietaryConsiderations.map((diet, index) => (
          // had to add key to div
          <div className="form-check" key={index}>
            <input
              {...register("dietary")}
              id={diet}
              className="form-check-input"
              type="checkbox"
              key={diet}
              value={diet}
            />
            <label className="form-check-label" htmlFor="dietary">
              {diet}
            </label>
          </div>
        ))}
        {/* 
        // bootstrap checkbox format
        <div className="form-check">
          <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckChecked"
          checked
          />
          <label className="form-check-label" htmlFor="flexCheckChecked">
          Checked checkbox
          </label>
        </div> */}
        {errors.dietary && (
          <p className="text-danger">{errors.dietary.message}</p>
        )}
      </div>

      {/* Submit */}
      <button disabled={!isValid} className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default DishForm;