import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  dishCategories,
  dishCategoriesEnum,
} from "../categories/dishCategories";
import {
  dietaryConsiderations,
  dietaryConsiderationsEnum,
} from "../categories/dietaryConsiderations";
import { capitalizeFirstLetter } from "../functions/functions";
import usePutDish from "../hooks/usePutDish";
import { Dish, DishDocumentType } from "../interfaces/interfaces";
import { Fade } from "@mui/material";

const dishSchema = z.object({
  userName: z
    .string()
    .min(2, { message: "Enter at least 2 characters" })
    .max(50),
  category: z.enum(dishCategories, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  name: z.string().min(2, { message: "Enter at least 2 characters" }).max(50),
  amount: z.number({ invalid_type_error: "Amount is required" }).min(1).max(99),
  dietary: z.enum(dietaryConsiderations).array().optional(),
});

export type EditDishFormData = z.infer<typeof dishSchema>;

interface Props {
  dish: DishDocumentType;
  editItemDisplay: boolean;
  onSubmit: () => void;
}

const EditDishForm = ({ dish, editItemDisplay, onSubmit }: Props) => {
  // returns object
  const {
    register,
    // trigger,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EditDishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      userName: dish.userName,
      category: dish.category as dishCategoriesEnum,
      name: dish.name,
      amount: dish.amount,
      dietary: dish.dietary as dietaryConsiderationsEnum[],
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
    <Fade in={editItemDisplay}>
      <form
        // handleSubmit from react hook form, this function will receive the form data if form validation is successful
        // data is ready to send to the server
        onSubmit={handleSubmit(async (editDishFormData) => {
          if (dish._id === undefined) throw new Error("dish._id is undefined");

          const dishWithPublicId = {
            ...editDishFormData,
            publicId: dish.publicId,
          };

          const result = await putDishMutateAsync({
            itemId: dish._id.toString(),
            data: dishWithPublicId,
          });

          console.log(result);

          onSubmit();

          reset();
        })}
      >
        <div className="row" key="formRow">
          <div className="col-sm p-2 border border-primary-subtle">
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

          <div className="col-sm p-2 border border-primary-subtle">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            {/* // hook form register function, spread result, copy all previous values */}
            <select
              {...register("category")}
              id="category"
              className="form-select"
            >
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

          <div className="col-sm p-2 border border-primary-subtle">
            <label htmlFor="name" className="form-label">
              Dish Name
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

          <div className="col-sm p-2 border border-primary-subtle">
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

          <div className="col-sm p-2 border border-primary-subtle">
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

          <div className="col-sm p-2 border border-primary-subtle">
            <button
              disabled={!isValid}
              className="btn btn-primary"
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

export default EditDishForm;
