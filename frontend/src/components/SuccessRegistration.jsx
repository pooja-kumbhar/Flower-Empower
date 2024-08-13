import { useNavigate } from "react-router-dom";

function SuccessRegistration() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/registration-validation");
  }

  return (
    <div className="flex mt-72 justify-center">
      <div className="flex flex-col items-center justify-evenly gap-y-9">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-20 text-[#e48dde]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <p className="text-3xl leading-relaxed text-gray-700">
          We sent a code to your mail box please check and continue
        </p>
        <button
          className="cursor-pointer rounded-lg bg-[#e48dde] px-7 py-3 text-lg text-white hover:bg-[#e48dde]"
          onClick={() => handleClick()}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default SuccessRegistration;
