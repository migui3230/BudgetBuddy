import { Select } from "@mantine/core";

export default function Role() {
  return (
    <>
      <Select
        label="Select your role"
        placeholder="Pick one"
        data={[
          { value: "user", label: "User" },
          { value: "pro", label: "Pro" },
          { value: "admin", label: "Admin" },
        ]}
      />
    </>
  );
}
