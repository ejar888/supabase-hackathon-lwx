"use client";

import { Stack, Loader } from "@mantine/core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/app/hooks/auth";

/**
 * HOC for page that should only be accessible by authenticated/logged-in user only
 */
export function AuthOnly({ children }) {
  const { isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading)
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader size={50} />
      </Stack>
    );

  return children;
}
