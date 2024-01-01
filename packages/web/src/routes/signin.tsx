export default function SigninRoute() {
  return (
    <section class="container mx-auto max-w-3xl px-6">
      <div class="px-5 py-56 mx-auto">
        <div class="flex flex-col text-center w-full mb-10">
          <h1 class="text-lg font-medium title-font text-white mb-2">
            Welcome to the Git Tracker
          </h1>
          <p class="text-base leading-relaxed">
            Sign in with your github to get started
          </p>
        </div>

        <div class="lg:w-1/2 md:w-2/3 mx-auto">
          <div class="grid gap-y-4">
            <a
              href={`${import.meta.env.VITE_APP_API_URL}/auth/github/authorize`}
              rel="noreferrer"
              class="w-full text-center text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded"
            >
              Sign in with Github
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
