"use client";

import { Stack } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
import { notifications } from "@mantine/notifications";
import { useParams, useRouter } from "next/navigation";
import { decode } from "base64-arraybuffer";

import { useAuthContext } from "@/app/hooks/auth";

const Webcam = dynamic(
  () => import("@/app/components/Camera").then(({ Camera }) => Camera),
  { ssr: false },
);

export default function Page() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleUploadAvatar = async ({ image, embedding }) => {
    try {
      const [{ error: updateError }, { error: uploadError }] =
        await Promise.all([
          supabase
            .from("user")
            .update({ avatar_embedding: embedding })
            .match({ id }),
          supabase.storage
            .from("organization")
            .upload(
              `${user.id}/user/${id}/avatar.jpg`,
              decode(image.slice(22)),
              {
                upsert: true,
                contentType: "image/jpeg",
              },
            ),
        ]);
      if (updateError || uploadError) {
        console.error(updateError, uploadError);
        throw new Error(
          [updateError?.message ?? "", uploadError?.message ?? ""].join("\n"),
        );
      }
      notifications.show({
        title: "Successfully uploaded avatar",
      });
      router.push("/");
    } catch (error) {
      notifications.show({
        title: "Error uploading avatar",
        message: error.message,
      });
    }
  };

  return (
    <Stack align="center" justify="center" h="100%">
      <Webcam onFaceDetected={handleUploadAvatar} />
    </Stack>
  );
}
