import { Stack, Loader } from "@mantine/core";

export default function CircularProgress({ size, isLoading, children }) {
  if (isLoading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader size={size ?? 50} />
      </Stack>
    );
  }
  return children;
}
