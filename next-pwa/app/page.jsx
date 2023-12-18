"use client";

import { Button, Group, Stack } from "@mantine/core";
import { AuthOnly } from "./components/Auth";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { notifications } from "@mantine/notifications";

const Webcam = dynamic(
  () => import("@/app/components/Camera").then(({ Camera }) => Camera),
  { ssr: false },
);

export default function Page() {
  const supabase = createClientComponentClient();

  return (
    <AuthOnly>
      <Stack justify="center" align="center" mt="md">
        <Webcam>
          {({ getFace }) => {
            const handleClocking = async (type) => {
              try {
                const { embedding } = await getFace();
                const {
                  data: [user],
                  error: faceRecognitionError,
                } = await supabase.rpc("face_recognition", {
                  query_embedding: embedding,
                  match_threshold: 0.9,
                  match_count: 1,
                });
                if (faceRecognitionError) {
                  console.error(faceRecognitionError);
                  throw new Error(faceRecognitionError.message);
                }
                if (!user) {
                  throw new Error("No matching user found");
                }
                const { error: insertError } = await supabase
                  .from("timelog")
                  .insert({
                    user_id: user.id,
                    type,
                  });
                if (insertError) {
                  console.error(insertError);
                  throw new Error(insertError.message);
                }
                notifications.show({
                  title: `${user.first_name} clocked ${type}`,
                });
              } catch (error) {
                notifications.show({
                  title: `Error clocking ${type}`,
                  message: error.message,
                });
              }
            };

            return (
              <Group>
                <Button onClick={() => handleClocking("in")}>Clock In</Button>
                <Button onClick={() => handleClocking("out")}>Clock Out</Button>
              </Group>
            );
          }}
        </Webcam>
      </Stack>
    </AuthOnly>
  );
}
