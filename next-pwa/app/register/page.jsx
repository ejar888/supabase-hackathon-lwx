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
      passwordConfirmation: "",
    },
    validate: {
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 characters" : null,
      passwordConfirmation: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleRegister = async ({ email, password }) => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/`,
      },
    });
    router.refresh();
  };

  return (
    <AnonOnly>
      <Box maw={340} mx="auto" mt="25vh">
        <form onSubmit={form.onSubmit(handleRegister)}>
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
          <TextInput
            type="password"
            label="Confirm Password"
            {...form.getInputProps("passwordConfirmation")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Register</Button>
          </Group>
        </form>
        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Link
            style={{
              textDecoration: "underline",
              color: "lightblue",
            }}
            href={"/login"}
          >
            Login here
          </Link>
        </Text>
      </Box>
    </AnonOnly>
  );
}
