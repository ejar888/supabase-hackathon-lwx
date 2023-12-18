"use client";

import { Table, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";

import CircularProgress from "@/app/components/Loading/CircularProgress";
import { AuthOnly } from "@/app/components/Auth";

export default function Page() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase
      .from("user")
      .select(
        `
          avatar_embedding,
          first_name,
          last_name,
          timelog (
            type,
            created_at
          )
      `,
      )
      .eq("id", params.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          throw new Error(error.message);
        }
        console.log(data);
        setUser(data[0]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const rows = user?.timelog?.map(({ created_at, type }) => {
    const timestamp = new Date(created_at);
    return (
      <Table.Tr key={created_at}>
        <Table.Td>{timestamp.toLocaleDateString()}</Table.Td>
        <Table.Td>{timestamp.toLocaleTimeString()}</Table.Td>
        <Table.Td style={{ textTransform: "capitalize" }}>{type}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <AuthOnly>
      <CircularProgress isLoading={isLoading}>
        <Title ta="center">
          {`${user?.first_name} ${user?.last_name}`}
          {user?.avatar_embedding ? (
            ""
          ) : (
            <Link
              href={`/users/${params.id}/upload-avatar`}
              title="Upload avatar to complete user information."
            >
              <IconAlertCircle />
            </Link>
          )}
        </Title>
        {user?.timelog?.length ? (
          <Table my="xl">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th>Type</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        ) : (
          <Text>No timelog to show</Text>
        )}
      </CircularProgress>
    </AuthOnly>
  );
}
