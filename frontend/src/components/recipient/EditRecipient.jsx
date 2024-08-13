/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import API from "../../axios";
import toast from "react-hot-toast";
import LabelAndInput from "../LabelAndInput";
import Loader from "../Loader";
import { useCookies } from "react-cookie";

function EditRecipient({ id, setOpen, setEditClicked, currRecipient }) {
  const [cookies] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.patch(`recipients/${id}/`, obj, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipients"],
      });
      setEditClicked(false);
      setOpen(false);
      toast.success("Address edited!");
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
            Add the recipients address in the form below
          </p>

          <div className="grid p-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-1 md:space-y-4 lg:space-y-8  lg:pb-12">
            <div className="self-end">
              <LabelAndInput
                htmlFor="first_name"
                type="text"
                register={register}
                name="first_name"
                value={currRecipient?.first_name}
              >
                First Name
              </LabelAndInput>
            </div>

            <LabelAndInput
              htmlFor="last_name"
              type="text"
              register={register}
              name="last_name"
              value={currRecipient?.last_name}
            >
              Last Name
            </LabelAndInput>

            <LabelAndInput
              htmlFor="address"
              type="text"
              register={register}
              name="address"
              value={currRecipient?.address}
            >
              Street
            </LabelAndInput>

            <LabelAndInput
              htmlFor="city"
              type="text"
              register={register}
              name="city"
              value={currRecipient?.city}
            >
              City
            </LabelAndInput>

            <LabelAndInput
              htmlFor="state"
              type="text"
              register={register}
              name="state"
              value={currRecipient?.state}
              pattern="[A-Z]{2}"
              placeholder="CA"
            >
              State
            </LabelAndInput>

            <LabelAndInput
              htmlFor="zip"
              type="text"
              register={register}
              name="zip"
              value={currRecipient?.zip}
              pattern="[0-9]{5}"
              placeholder="12345"
            >
              Zip
            </LabelAndInput>
            <LabelAndInput
              htmlFor="date"
              type="date"
              register={register}
              name="end_date"
              value={currRecipient?.end_date}
            >
              End Date
            </LabelAndInput>
            <LabelAndInput
              htmlFor="group"
              type="text"
              register={register}
              name="group"
              value={currRecipient?.group}
            >
              Group
            </LabelAndInput>
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

export default EditRecipient;
