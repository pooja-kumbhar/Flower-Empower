import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();
  return (
    <>
      <main className="grid min-h-full justify-center place-items-start bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-[#e48dde]">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            You cannot access this page
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Please go back
          </p>
          <button
            className="text-white bg-[#e48dde] rounded-lg py-2 px-4 hover:bg-[#d973d2] cursor-pointer border-none mt-6"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
          <div className="mt-10 flex items-center justify-center gap-x-6"></div>
        </div>
      </main>
    </>
  );
}

export default AdminPage;
