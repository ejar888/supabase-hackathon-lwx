"use client";

import { Group, Text } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconLogout } from "@tabler/icons-react";

import { useAuthContext } from "@/app/hooks/auth";

export function LogoutButton({ withLabel, onClick }) {
  const supabase = createClientComponentClient();
  const { user } = useAuthContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClick();
  };

  return (
    <Group
      align="flex-start"
      onClick={handleLogout}
      style={{ cursor: "pointer" }}
    >
      {user && (
        <>
        <span title="logout">
          <IconLogout />
        </span>
        { withLabel && (<Text>Logout</Text>) }
        </>
      )}
    </Group>
  );
}
