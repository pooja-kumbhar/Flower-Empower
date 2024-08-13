/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../axios";
import Loader from "../Loader";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function DriverEmail({ event, evId, token }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.post(`events/senddriveremail/${evId}/`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });

      toast.success(`Emails to drivers sent successfully!`);
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
    <>
      {event?.closed ? null : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center mt-12">
            <button
              disabled={isPending}
              className="bg-[#e48dde] py-2 px-4 text-white rounded-xl hover:bg-[#d973d2]"
            >
              SEND DRIVER EMAILS
            </button>
            <input type="hidden" name="subject" {...register("subject")} />
            <input type="hidden" name="body" {...register("body")} />
          </div>
        </form>
      )}
    </>
  );
}

export default DriverEmail;
