import LoginCard from "@/components/LoginCard";
import Title from "@/components/Title";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <Title />
      <LoginCard />
    </main>
  );
}
