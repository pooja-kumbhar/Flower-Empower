/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../axios";
import toast from "react-hot-toast";
import { CiLock } from "react-icons/ci";
import { useForm } from "react-hook-form";

function Closed({ event, cookies }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.patch(`events/${event.id}/`, obj, {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      toast.success("Event open!");
    },
    onError: () => {
      toast.error("Oh no, retry :(");
    },
  });

  function onSubmit(data) {
    mutate(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button disabled={isPending}>
        <CiLock style={{ fontSize: "24px", cursor: "pointer" }} />
      </button>
      <input
        type="hidden"
        name="closed"
        value="false"
        {...register("closed")}
      />
    </form>
  );
}

export default Closed;
