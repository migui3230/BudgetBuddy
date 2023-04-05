import { Button, Select } from "@mantine/core";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

/* 
handleClick function
- builds the user data to send to the db
- send a post request to the db
- redirect to plaid


*/

export default function Role() {
  const [role, setRole] = useState(String);
  //   console.log(role);
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  const router = useRouter();

  //   console.log(userEmail);

  const handleClick = async () => {
    try {
      const data = {
        email: userEmail,
        role: role,
      };

      await axios.post("http://127.0.0.1:5000/api/addUser", data);
      router.push("/plaid");
    } catch (error) {
      console.log(error);
      //   router.push("/plaid");
    }
  };

  //   console.log(user);

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
        onChange={(value: string) => setRole(value)}
      />
      <Button onClick={handleClick}>Submit Data</Button>
    </>
  );
}
