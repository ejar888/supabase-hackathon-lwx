"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextInput, Button, Group, Box, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import { AnonOnly } from "@/app/components/Auth";

export default function Login() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async ({ email, password }) => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  return (
    <AnonOnly>
      <Box maw={340} mx="auto" mt="30vh">
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            label="Email"
            type="email"
            {...form.getInputProps("email")}
          />
          <TextInput
            type="password"
            label="Password"
            {...form.getInputProps("password")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Login</Button>
          </Group>
        </form>
        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Link
            style={{
              textDecoration: "underline",
              color: "lightblue",
            }}
            href={"/register"}
          >
            Register here
          </Link>
        </Text>
      </Box>
    </AnonOnly>
  );
}
