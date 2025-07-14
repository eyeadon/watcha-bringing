import { zodResolver } from "@hookform/resolvers/zod";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import { nanoid } from "nanoid";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { EventFormIsExpandedContext } from "../contexts/contexts.js";
import { setTimeDayJs } from "../functions/functions.js";
import usePostEvent from "../hooks/usePostEvent.js";
import { EventDocumentType } from "../interfaces/interfaces.js";
import usePutUser from "../hooks/usePutUser.js";
import { useAuth0 } from "@auth0/auth0-react";
import useUserByEmail from "../hooks/useUserByEmail.js";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault("America/New_York");

const eventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Enter at least 2 characters" })
    .max(50),
  hostName: z
    .string()
    .trim()
    .min(2, { message: "Enter at least 2 characters" })
    .max(50),
  address: z.object({
    street: z
      .string()
      .trim()
      .min(2, { message: "Enter at least 2 characters" })
      .max(50),
    city: z
      .string()
      .trim()
      .min(2, { message: "Enter at least 2 characters" })
      .max(50),
    state: z.string().trim().min(2).max(2),
    zipcode: z.string().trim().min(5).max(5),
  }),
  startDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Invalid date"),
  endDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Invalid date"),
  // startDateTime: z.instanceof(dayjs as unknown as typeof Dayjs),
  startTime: z.custom<Dayjs>((val) => val instanceof dayjs, "Invalid date"),
  endTime: z.custom<Dayjs>((val) => val instanceof dayjs, "Invalid date"),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface Props {
  onSubmit: (data: EventDocumentType) => void;
}

const EventForm = ({ onSubmit }: Props) => {
  // returns object
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    control,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      startDate: null as unknown as Dayjs,
      endDate: null as unknown as Dayjs,
      startTime: null as unknown as Dayjs,
      endTime: null as unknown as Dayjs,
    },
  });

  const contextEventFormIsExpanded = useContext(EventFormIsExpandedContext);

  // post Event
  const { mutateAsync: postEventMutateAsync } = usePostEvent();

  const { user: auth0User, error: errorAuth } = useAuth0();

  // Dependent query, dependent on useUserByEmail parameter.
  // Check if user exists in mongoDB database, get by email.
  const {
    data: user,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useUserByEmail(auth0User?.email!);

  const { mutateAsync: putUserMutateAsync } = usePutUser();

  if (errorAuth) {
    return <p>Error: {errorAuth.message}</p>;
  }

  if (isLoadingUser) {
    return <p>Loading...</p>;
  }

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        // handleSubmit from react hook form
        onSubmit={handleSubmit(async (newEventFormData) => {
          if (user === undefined) throw new Error("user is undefined");
          if (user._id === undefined) throw new Error("user id is undefined");

          const publicId = nanoid();

          const newEventWithPublicId = {
            publicId: publicId,
            name: newEventFormData.name,
            host: user.publicId,
            hostName: newEventFormData.hostName,
            address: newEventFormData.address,
            startDateTime: setTimeDayJs(
              newEventFormData.startDate,
              newEventFormData.startTime
            ).toDate(),
            endDateTime: setTimeDayJs(
              newEventFormData.endDate,
              newEventFormData.endTime
            ).toDate(),
          };

          console.log(newEventWithPublicId);

          const resultEventFromMutate = await postEventMutateAsync(
            newEventWithPublicId
          );

          console.log(resultEventFromMutate);

          // add event publicId to user.eventsOwned
          user.publicId !== "none"
            ? user.eventsOwned!.push(newEventWithPublicId.publicId)
            : new Error("no user selected");

          const userWithoutId = { ...user };
          delete userWithoutId._id;

          const resultUserFromMutate = await putUserMutateAsync({
            itemId: user._id.toString(),
            data: userWithoutId,
          });

          console.log(resultUserFromMutate);

          // pass new event to parent
          onSubmit(resultEventFromMutate);

          contextEventFormIsExpanded.setEventFormIsExpanded(
            !contextEventFormIsExpanded.eventFormIsExpanded
          );

          reset();
        })}
      >
        <div className="row mb-1">
          <div className="col-sm mb-3">
            <h3 className="mb-3">Event Details</h3>
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
              <label htmlFor="hostName" className="form-label">
                Host Name
              </label>
              <input
                {...register("hostName")}
                id="hostName"
                type="text"
                className="form-control"
              />
              {errors.hostName && (
                <p className="text-danger">{errors.hostName.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <div className="mb-3">
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { name, onChange, value, ref } }) => {
                    return (
                      <DatePicker
                        // label="MM/DD/YYYY"
                        name={name}
                        value={value}
                        inputRef={ref}
                        onChange={onChange}
                        disablePast={true}
                        slotProps={{
                          actionBar: {
                            actions: ["clear", "today", "accept"],
                          },
                        }}
                      />
                    );
                  }}
                />
              </div>
              {errors.startDate && (
                <p className="text-danger">{errors.startDate.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <div className="mb-3">
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { name, onChange, value, ref } }) => {
                    return (
                      <DatePicker
                        // label="MM/DD/YYYY"
                        name={name}
                        value={value}
                        inputRef={ref}
                        onChange={onChange}
                        disablePast={true}
                        slotProps={{
                          actionBar: {
                            actions: ["clear", "today", "accept"],
                          },
                        }}
                      />
                    );
                  }}
                />
              </div>
              {errors.endDate && (
                <p className="text-danger">{errors.endDate.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">
                Start Time
              </label>
              <div className="mb-3">
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field: { name, onChange, value, ref } }) => {
                    return (
                      <TimePicker
                        // label="hh:mm aa"
                        name={name}
                        value={value}
                        inputRef={ref}
                        onChange={onChange}
                        minutesStep={15}
                        timeSteps={{ minutes: 15 }}
                      />
                    );
                  }}
                />
              </div>
              {errors.startTime && (
                <p className="text-danger">{errors.startTime.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">
                End Time
              </label>
              <div className="mb-3">
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field: { name, onChange, value, ref } }) => {
                    return (
                      <TimePicker
                        // label="hh:mm aa"
                        name={name}
                        value={value}
                        inputRef={ref}
                        onChange={onChange}
                        minutesStep={15}
                        timeSteps={{ minutes: 15 }}
                      />
                    );
                  }}
                />
              </div>
              {errors.endTime && (
                <p className="text-danger">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="col-sm mb-3">
            <h3 className="mb-3">Address</h3>

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
          </div>
          {/* end row */}
        </div>

        {/* Submit */}
        <button disabled={!isValid} className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </LocalizationProvider>
  );
};

export default EventForm;
