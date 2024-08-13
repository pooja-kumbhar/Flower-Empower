/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import API from "../axios";
import toast from "react-hot-toast";

function DriverBook({ id, driver, event }) {
  const [cookies] = useCookies(["user"]);
  const { register, handleSubmit } = useForm();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.patch(`user/${id}/`, obj, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Hours added!");
    },
    onError: () => {
      toast.error("Oh no, retry :(");
    },
  });
  console.log(error);
  console.log(driver);
  console.log(event);

  function onSubmit(data) {
    console.log(data);
    mutate({ ...data, hours: driver?.hours + 3 });
  }
  return (
    <>
      {isSuccess ? null : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            className="bg-[#e48dde] hover:bg-[#e48dde] cursor-pointer py-1 px-2 text-white rounded-xl"
            type="submit"
          >
            Book
          </button>
          <input type="hidden" name="hours" value="3" {...register("hours")} />
        </form>
      )}
    </>
  );
}

export default DriverBook;
