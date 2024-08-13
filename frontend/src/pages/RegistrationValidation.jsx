import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import LabelAndInput from "../components/LabelAndInput";
import API from "../axios.js";
import toast from "react-hot-toast";

function RegistrationValidation() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (obj) => {
      const res = await API.post("registration/validation/", obj);

      return res.data;
    },
    onSuccess: () => {
      toast.success("You successfully registered!");
      navigate("/login");
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  if (isPending) return <Loader />;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <div className="flex justify-center">
              <h2 className="bg-slate-150 mt-14 w-fit  text-3xl text-center">
                REGISTRATION VALIDATION
              </h2>
            </div>

            <div className="grid p-10 lg:grid-cols-2  md:grid-cols-2 sm:grid-cols-1 gap-4 mt-10 space-y-8  pb-12">
              <div className="self-end">
                <LabelAndInput
                  htmlFor="email"
                  type="text"
                  register={register}
                  name="email"
                  isRequired={true}
                >
                  Email *
                  <span className="ml-2 text-red-500">
                    {isError && error?.response?.data?.email}
                  </span>
                </LabelAndInput>
              </div>
              <div>
                <LabelAndInput
                  htmlFor="code"
                  type="text"
                  register={register}
                  name="code"
                >
                  Code *
                  <span className="ml-2 text-red-500">
                    {isError && error?.response?.data?.code}
                  </span>
                </LabelAndInput>
              </div>
              <div>
                <LabelAndInput
                  htmlFor="first_name"
                  type="text"
                  register={register}
                  name="first_name"
                >
                  First Name *
                  <span className="ml-2 text-red-500">
                    {isError && error?.response?.data?.first_name}
                  </span>
                </LabelAndInput>
              </div>
              <div>
                <LabelAndInput
                  htmlFor="last_name"
                  type="text"
                  register={register}
                  name="last_name"
                >
                  Last name *
                  <span className="ml-2 text-red-500">
                    {isError && error?.response?.data?.last_name}
                  </span>
                </LabelAndInput>
              </div>
              <div>
                <LabelAndInput
                  htmlFor="password"
                  type="password"
                  register={register}
                  name="password"
                >
                  Password *
                  <span className="ml-2 text-red-500">
                    {(isError && error?.response?.data?.non_field_errors) ||
                      error?.response?.data?.password}
                  </span>
                </LabelAndInput>
              </div>
              <LabelAndInput
                htmlFor="password_repeat"
                type="password"
                register={register}
                name="password_repeat"
              >
                Repeat password *
              </LabelAndInput>
              <div>
                <LabelAndInput
                  htmlFor="phone"
                  type="tel"
                  register={register}
                  name="phone"
                  pattern="\b[2-9][0-9]{2} [2-9][0-9]{2} [0-9]{4}\b"
                  placeholder="555 235 7832"
                >
                  Phone *
                  <span className="ml-2 text-red-500">
                    {isError && error?.response?.data?.phone}
                  </span>
                </LabelAndInput>
              </div>
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  htmlFor="comunication"
                >
                  Preferred comunication
                </label>
                <select
                  id="country"
                  name="preferred_communication"
                  {...register("preferred_communication")}
                  defaultValue="Phone"
                  className="relative block w-full rounded-none rounded-t-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option>Phone</option>
                  <option>Email</option>
                </select>
              </div>

              <button className="cursor-pointer lg:col-span-2 md:col-span-2 md:place-self-center md:justify-self-center  lg:place-self-center lg:justify-self-center rounded-xl bg-[#e48dde] px-8 py-2 text-white hover:bg-[#d973d2]">
                {isPending
                  ? "Finishing Registration..."
                  : "Finish Registration"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default RegistrationValidation;
