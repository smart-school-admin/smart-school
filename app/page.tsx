import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/general/logo";

export default function Home() {
  return (
    <main className="w-full h-screen">
      <div className="h-full w-full">
        <div className="flex justify-between items-center bg-ssPrimary-100 p-4">
          <Logo />
          <div className="flex justify-center items-center">
            <Link href="/login" className="text-2xl text-white">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
