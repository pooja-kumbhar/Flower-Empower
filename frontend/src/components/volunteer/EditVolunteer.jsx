/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import API from "../../axios";
import toast from "react-hot-toast";
import LabelAndInput from "../LabelAndInput";
import Loader from "../Loader";
import { useCookies } from "react-cookie";

function EditVolunteer({ userId, setOpen, setEditClicked, currUser }) {
  const [cookies] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.patch(`user/${userId}/`, obj, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setEditClicked(false);
      toast.success("Volunteer edited!");
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
            Personal Information
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Edit the volunteer information in the form below
          </p>

          <div className="grid p-10  md:grid-cols-2 sm:grid-cols-1 gap-4 mt-10 space-y-8  pb-12">
            <div className="self-end">
              <LabelAndInput
                htmlFor="first_name"
                type="text"
                register={register}
                name="first_name"
                value={currUser?.first_name}
              >
                First Name
              </LabelAndInput>
            </div>

            <LabelAndInput
              htmlFor="last_name"
              type="text"
              register={register}
              name="last_name"
              value={currUser?.last_name}
            >
              Last Name
            </LabelAndInput>

            <LabelAndInput
              htmlFor="email"
              type="email"
              register={register}
              name="email"
              value={currUser?.email}
            >
              Email
            </LabelAndInput>
            <LabelAndInput
              htmlFor="phone"
              type="tel"
              register={register}
              name="phone"
              value={currUser?.phone}
              pattern="\b[2-9][0-9]{2} [2-9][0-9]{2} [0-9]{4}\b"
              placeholder="555 235 7832"
            >
              Phone
            </LabelAndInput>

            <div>
              <label
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                htmlFor="comunication"
              >
                Preferred communication
              </label>
              <select
                id="country"
                name="preferred_communication"
                {...register("preferred_communication")}
                defaultValue={currUser?.preferred_communication}
                className="relative block w-full rounded-none rounded-t-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>Phone</option>
                <option>Email</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          onClick={() => {
            setOpen(false);
            setEditClicked(false);
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

export default EditVolunteer;
