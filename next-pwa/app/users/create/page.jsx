"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { TextInput, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { AuthOnly } from "@/app/components/Auth";

export default function Login() {
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
    },
    validate: {
      first_name: (value) => (value ? null : "First name cannot be empty"),
      last_name: (value) => (value ? null : "Last name cannot be empty"),
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleCreate = async ({ first_name, last_name }) => {
    setIsSubmitting(true);
    try {
      const {
        data: [{ id } = {}],
        error,
      } = await supabase
        .from("user")
        .insert({
          first_name,
          last_name,
        })
        .select();
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      router.push(`/users/${id}/upload-avatar`);
    } catch (error) {
      notifications.show({
        title: "Error creating user",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthOnly>
      <Box maw={340} mx="auto" mt="25vh">
        <form onSubmit={form.onSubmit(handleCreate)}>
          <TextInput label="First Name" {...form.getInputProps("first_name")} />
          <TextInput label="Last Name" {...form.getInputProps("last_name")} />
          <Group justify="flex-end" mt="md">
            <Button type="submit" disabled={isSubmitting}>
              Add
            </Button>
          </Group>
        </form>
      </Box>
    </AuthOnly>
  );
}
