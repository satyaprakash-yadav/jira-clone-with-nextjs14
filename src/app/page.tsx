'use client'

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const {data, isLoading} = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data, isLoading, router]);

  return (
    <div className="">
      Only visible to authorized users.
      <Button onClick={()=>mutate()}>
        Logout <LogOut className="size-5 mx-1" />
      </Button>
    </div>
  );
}
