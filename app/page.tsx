'use client';

import Autocomplete from "./components/Autocomplete";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  const accessToken: string = session?.accessToken || "";
console.log('accessToken >>>>', accessToken);
console.log('session >>>>', session);

  return (
    <div>
      {accessToken && <Autocomplete accessToken={accessToken} />}
    </div>
  );
}
