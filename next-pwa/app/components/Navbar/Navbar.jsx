"use client";

import Link from "next/link";

import { Group, Burger, Title, Drawer, Center, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFaceId, IconUsers } from "@tabler/icons-react";

import classes from "./Navbar.module.css";
import { LogoutButton } from "./LogoutButton";
import { useAuthContext } from "@/app/hooks/auth";

export function Navbar() {
  const { user } = useAuthContext();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <>
      <header className={classes.header}>
        <Group justify="space-between" sx={{ height: "100%" }}>
          <Group>
            <Link href="/">
              <Group>
                <IconFaceId size={30} />
                <Title size="h3">The Attendance App</Title>
              </Group>
            </Link>
          </Group>

          <Group display={{ base: "none", sm: "flex" }}>
            {user && (
              <Link href="/users" title="users">
                <IconUsers />
              </Link>
            )}
            <LogoutButton />
          </Group>

          <Group display={{ sm: "none" }}>
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        zIndex={1000000}
        position="right"
        display={{ sm: "none" }}
      >
        {user && (
          <Center m="sm">
            <Link href="/users" title="users">
              <IconUsers />
              <Text ml="lg">Users</Text>
            </Link>
          </Center>
        )}
        <Center m="sm">
          <LogoutButton withLabel />
        </Center>
      </Drawer>
    </>
  );
}
