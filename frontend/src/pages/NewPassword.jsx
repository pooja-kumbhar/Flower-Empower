import { useForm } from "react-hook-form";
import LabelAndInput from "../components/LabelAndInput";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function NewPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (email) => {
      await API.patch("password-reset/validate/", email);
    },
    onSuccess: () => {
      navigate("/login");
      toast.success("Great! Password changed ");
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
      <h2 className=" text-3xl">SET NEW PASSWORD</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 grid w-full grid-cols-2 gap-x-4 space-y-6"
      >
        <div className="w-full place-self-end justify-self-start">
          <LabelAndInput
            htmlFor="email"
            type="email"
            register={register}
            name="email"
          >
            Email address
          </LabelAndInput>
        </div>

        <LabelAndInput
          htmlFor="code"
          type="text"
          register={register}
          name="code"
        >
          Validation Code
        </LabelAndInput>
        <LabelAndInput
          htmlFor="password"
          type="password"
          register={register}
          name="password"
        >
          New password
        </LabelAndInput>

        <LabelAndInput
          htmlFor="password_repeat"
          type="password"
          register={register}
          name="password_repeat"
        >
          New Password repeat
        </LabelAndInput>
        {isError ? (
          <p className="text-red-500">
            {error?.response?.data?.non_field_errors ||
              error?.response?.data?.email ||
              "Code is wrong"}
          </p>
        ) : null}

        <div className="col-span-2 place-self-center justify-self-center">
          <button className="flex w-full justify-center rounded-md bg-[#e48dde] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d973d2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
            CHANGE PASSWORD
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPassword;
