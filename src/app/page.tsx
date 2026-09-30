import { AutomaticStartupSequence } from "@/components/sections/AutomaticStartupSequence";

export default function HomePage() {
  return (
    <main
      className="min-h-screen w-full bg-[#EAE8E1] text-[#111111]"
      style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
    >
      <AutomaticStartupSequence />
    </main>
  );
}

