export default function SigninRoute() {
  return (
    <main class="container max-w-md min-h-min flex flex-col items-center justify-center mx-auto p-6">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <header class="flex flex-col space-y-1.5 p-6">
          <h1 class="text-2xl font-semibold leading-none tracking-tight">
            Login
          </h1>
          <p class="text-sm text-muted-foreground">test</p>
        </header>

        <div class="p-6 pt-0">
          <a
            href={`${import.meta.env.VITE_APP_API_URL}/auth/github/authorize`}
            rel="noreferrer"
          >
            Sign in with Github
          </a>
        </div>
      </div>
    </main>
  );
}
