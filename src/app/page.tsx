
import { SchoolLogo } from "@/components/school-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-sans">
       <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto">
          <SchoolLogo className="h-24 w-24" />
        </div>
        <h1 className="text-4xl font-bold text-red-600">HCSSS</h1>
        <p className="text-xl text-foreground/80">
          Welcome to the HCSSS account portal.
        </p>
        <p className="text-foreground/60">
          Your authentication actions will be confirmed here.
        </p>
      </div>
       <footer className="absolute bottom-8 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} HCSSS. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
