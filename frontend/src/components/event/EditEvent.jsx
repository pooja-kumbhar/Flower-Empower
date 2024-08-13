/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import API from "../../axios";
import toast from "react-hot-toast";
import LabelAndInput from "../LabelAndInput";
import Loader from "../Loader";
import { useCookies } from "react-cookie";

function EditEvent({ eventId, setOpen, setEditClicked, currEvent }) {
  const [cookies] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.patch(`events/${eventId}/`, obj, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      setEditClicked(false);
      toast.success("Event edited!");
    },
    onError: () => {
      toast.error("Oh no, retry :(");
    },
  });

  function onSubmit(data) {
    mutate(data);
  }
  if (isPending) return <Loader />;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Event information
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Add the event information in the form below
          </p>

          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 mt-10 text-start">
            <LabelAndInput
              htmlFor="date"
              type="date"
              register={register}
              name="date"
              value={currEvent?.date}
            >
              Date
            </LabelAndInput>
            <LabelAndInput
              htmlFor="bouquet_makers_needed"
              type="number"
              register={register}
              name="bouquet_makers_needed"
              value={currEvent?.bouquet_makers_needed}
            >
              Bouquet makers needed
            </LabelAndInput>
            <LabelAndInput
              htmlFor="drivers_needed"
              type="number"
              register={register}
              name="drivers_needed"
              value={currEvent?.drivers_needed}
            >
              Drivers Needed
            </LabelAndInput>

            <div>
              <label
                className="block text-sm font-medium leading-6 mb-2 text-gray-900"
                htmlFor="group"
              >
                Group
              </label>

              <select
                id="group"
                name="group"
                {...register("group")}
                defaultValue={currEvent?.group}
                className="block w-full h-9   rounded-none rounded-t-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>1</option>
                <option>2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          onClick={() => {
            setOpen((prev) => !prev);
            setEditClicked((prev) => !prev);
          }}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button className="inline-flex justify-center rounded-md bg-[#e48dde] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#d973d2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </form>
  );
}

export default EditEvent;
