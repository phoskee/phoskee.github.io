import { LoanChart } from "./_components/loan-chart";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center bg-slate-50 p-8 pb-20 font-sans sm:p-20">
      <main className="flex w-full max-w-4xl flex-col space-y-16">
        <LoanChart />
      </main>
    </div>
  );
}
