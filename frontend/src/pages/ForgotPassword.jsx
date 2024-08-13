import { useForm } from "react-hook-form";
import LabelAndInput from "../components/LabelAndInput";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import API from "../axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (email) => {
      await API.post("password-reset/", email);
    },
    onSuccess: () => {
      navigate("/new-password");
      toast.success("Great! another step before changing the password ");
    },
    onError: () => {
      toast.error("Oh no... please try again :(");
    },
  });

  function onSubmit(data) {
    mutate(data);
  }
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col h-full items-center justify-start mt-40">
      <h2 className=" text-3xl">FORGOT PASSWORD</h2>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 grid w-full grid-cols-1  gap-x-4 space-y-6"
        >
          <LabelAndInput
            htmlFor="email"
            type="email"
            register={register}
            name="email"
          >
            Email address
          </LabelAndInput>

          <div className="col-span-2 place-self-center justify-self-center">
            <button className=" rounded-md bg-[#e48dde] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d973d2] ">
              SEND CODE
            </button>
          </div>
        </form>
        {isError && (
          <p className="text-red-500 text-center mt-4">
            {error?.response.data.email}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
