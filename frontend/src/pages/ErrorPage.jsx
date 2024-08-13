function ErrorPage() {
  return (
    <>
      <main className="grid min-h-full justify-center place-items-start bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-[#e48dde]">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="text-2xl mt-6  leading-7 text-gray-600">
            Sorry, we couldn't find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6"></div>
        </div>
      </main>
    </>
  );
}

export default ErrorPage;
