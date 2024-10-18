import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalizeFirstLetter } from "../functions/functions";

const eventSchema = z.object({
  name: z.string().min(2, { message: "Enter at least 2 characters" }).max(50),
  host: z.string().min(2, { message: "Enter at least 2 characters" }).max(50),
  address: z.object({
    street: z
      .string()
      .min(2, { message: "Enter at least 2 characters" })
      .max(50),
    city: z.string().min(2, { message: "Enter at least 2 characters" }).max(50),
    state: z.string().min(2).max(2),
    zipcode: z.string().min(5).max(5),
  }),
  date: z.string().date(),
  startTime: z.string().min(5).max(5),
  endTime: z.string().min(5).max(5),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface Props {
  onSubmit: (data: EventFormData) => void;
}

const BevForm = ({ onSubmit }: Props) => {
  // returns object
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EventFormData>({ resolver: zodResolver(eventSchema) });

  return (
    <form
      // handleSubmit from react hook form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
    >
      <div className="row">
        <div className="col-6 mb-3">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Event Name
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

          <div className="mb-3">
            <label htmlFor="host" className="form-label">
              Host Name
            </label>
            <input
              {...register("host")}
              id="host"
              type="text"
              className="form-control"
            />
            {errors.host && (
              <p className="text-danger">{errors.host.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              {...register("date")}
              id="date"
              type="date"
              className="form-control"
            />
            {errors.date && (
              <p className="text-danger">{errors.date.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="startTime" className="form-label">
              Start Time
            </label>
            <input
              {...register("startTime")}
              id="startTime"
              type="time"
              step="900"
              className="form-control"
            />
            {errors.startTime && (
              <p className="text-danger">{errors.startTime.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="endTime" className="form-label">
              End Time
            </label>
            <input
              {...register("endTime")}
              id="endTime"
              type="time"
              step="900"
              className="form-control"
            />
            {errors.endTime && (
              <p className="text-danger">{errors.endTime.message}</p>
            )}
          </div>

          <h3>Address</h3>

          <div className="mb-3">
            <label htmlFor="street" className="form-label">
              Street
            </label>
            <input
              {...register("address.street")}
              id="street"
              type="text"
              className="form-control"
            />
            {errors.address?.street && (
              <p className="text-danger">{errors.address?.street.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              {...register("address.city")}
              id="city"
              type="text"
              className="form-control"
            />
            {errors.address?.city && (
              <p className="text-danger">{errors.address?.city.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              {...register("address.state")}
              id="state"
              type="text"
              className="form-control"
            />
            {errors.address?.state && (
              <p className="text-danger">{errors.address?.state.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="zipcode" className="form-label">
              Zipcode
            </label>
            <input
              {...register("address.zipcode")}
              id="zipcode"
              type="text"
              className="form-control"
            />
            {errors.address?.zipcode && (
              <p className="text-danger">{errors.address?.zipcode.message}</p>
            )}
          </div>

          {/* Submit */}
          <button disabled={!isValid} className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default BevForm;
