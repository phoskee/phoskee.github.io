import { LoanChart } from "./_components/loan-chart";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center py-2 pb-20 font-sans sm:px-20">
      <main className="flex max-w-4xl flex-col space-y-16 md:w-svw">
        <LoanChart />
      </main>
    </div>
  );
}
