"use client";

import { Button, Group, Table, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { notifications } from "@mantine/notifications";
import {
  IconEye,
  IconAlertCircle,
  IconUsers,
  IconTrash,
} from "@tabler/icons-react";

import CircularProgress from "@/app/components/Loading/CircularProgress";
import { AuthOnly } from "@/app/components/Auth";

export default function Page() {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase
      .from("user")
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          throw new Error(error.message);
        }
        setUsers(data);
      })
      .catch((error) => {
        notifications.show({
          title: "Error fetching users",
          message: error.message,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = (id) => {
    supabase
      .from("user")
      .delete()
      .eq("id", id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          throw new Error(error.message);
        }
        setUsers(data);
      })
      .catch((error) => {
        notifications.show({
          title: "Error deleting users",
          message: error.message,
        });
      });
  };

  const rows = users?.map(({ id, first_name, last_name, avatar_embedding }) => (
    <Table.Tr key={id}>
      <Table.Td>
        {`${first_name} ${last_name}`}
        {avatar_embedding ? (
          ""
        ) : (
          <Link
            href={`/users/${id}/upload-avatar`}
            title="Upload avatar to complete user information."
          >
            <IconAlertCircle />
          </Link>
        )}
      </Table.Td>
      <Table.Td ta="end">
        <Link href={`/users/${id}`} title="View user">
          <IconEye cursor={"pointer"} />
        </Link>{" "}
        <span
          style={{ cursor: "pointer" }}
          title="Delete user"
          onClick={() => handleDelete(id)}
        >
          <IconTrash />
        </span>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AuthOnly>
      <CircularProgress isLoading={isLoading}>
        <Title ta="center">
          <IconUsers size={28} /> Users
        </Title>
        {users?.length ? (
          <Table
            my="xl"
            mx="auto"
            style={{
              maxWidth: "95%",
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th ta="end">Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        ) : (
          <Text>No users to show</Text>
        )}
        <Group justify="flex-end" m="xl">
          <Button>
            <Link href={"/users/create"}>Add User</Link>
          </Button>
        </Group>
      </CircularProgress>
    </AuthOnly>
  );
}
