import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import LabelAndInput from "../components/LabelAndInput";
import { useMutation } from "@tanstack/react-query";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import SuccessRegistration from "../components/SuccessRegistration";
import Logo from "../assets/img/logoFlower.webp";
import API from "../axios.js";

function Registration() {
  const { register, handleSubmit } = useForm();
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (email) => {
      await API.post("registration/", email);
    },
    onSuccess: () => {
      toast.success("Great! another step before signing up ");
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
    <>
      <>
        {isSuccess ? (
          <SuccessRegistration />
        ) : (
          <div className="flex min-h-full flex-1 flex-col justify-start px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign a new account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <LabelAndInput
                  htmlFor="email"
                  type="email"
                  register={register}
                  name="email"
                >
                  Email address
                </LabelAndInput>
                {isError ? (
                  <span className="text-red-500">
                    {error?.response.data.email}
                  </span>
                ) : null}

                <div>
                  <button
                    disabled={isPending}
                    className="flex w-full justify-center rounded-md bg-[#e48dde] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d973d2]"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already a volunteer?{" "}
                <NavLink
                  to="/login"
                  className="font-semibold leading-6 text-[#e48dde] hover:text-[#d973d2]"
                >
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default Registration;
