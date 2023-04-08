import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";
import React from "react";
import { table } from "console";

type UserData = {
  email: string;
  role: "user" | "pro" | "admin";
  id: number;
};

type PlaidAuthProps = {
  publicToken: string;
  account: any;
  transactions: any;
  tableUsers: UserData;
};

const PlaidAuthComponent = ({
  publicToken,
  account,
  transactions,
  tableUsers: tableUser,
}: PlaidAuthProps) => {
  // filter for the specific user based on the clerk email
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  console.log(userEmail);
  console.log(tableUser);
  // wait 1 second
  setTimeout(() => {
    console.log("waited 1 second");
  }, 1000);

  const userRole = tableUser.role;
  console.log(userRole);

  // console.log("userRole", userRole);

  if (userRole === "user") {
    // only render one account from the plaid api
    // only render the first item from the transactions array
  } else if (userRole === "pro") {
    // render all accounts from the plaid api
    // map over the transactions array and render each item
  } else if (userRole === "admin") {
    // render admin page / user management dashboard
  }

  return account ? (
    <>
      <p>Account number: {account.account}</p>
      <p>Routing number: {account.routing}</p>
      <p>Account_id: {account.account_id}</p>
      <p>Wire routing number: {account.wire_routing}</p>
      <p>Current balance: {transactions.accounts[0].balances.current} </p>
    </>
  ) : (
    <p>loading...</p>
  );
};

const PlaidAuth = React.memo(PlaidAuthComponent);
PlaidAuth.displayName = "PlaidAuth";

export default function Plaid() {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState<string | undefined>();
  const [account, setAccount] = useState();
  const [accessToken, setAccessToken] = useState();
  const [transactions, setTransactions] = useState();
  const [users, setUsers] = useState();
  const { user } = useUser();

  // TODO: check what the shape of the data looks like then render the plaidauth component from that
  console.log("transactions", transactions);

  useEffect(() => {
    async function getLinkToken() {
      const res = await axios.get("/api/create-link-token");
      setLinkToken(res.data.link_token);
    }
    getLinkToken();
  }, []);

  useEffect(() => {
    if (publicToken) {
      async function getAccessToken() {
        try {
          const response = await axios.post("/api/exchange-public-token", {
            public_token: publicToken,
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const accessToken = response.data.accessToken;
          setAccessToken(accessToken);

          const auth = await axios.post("/api/auth", {
            access_token: accessToken,
          });
          const transactions = await axios.post("/api/transactions", {
            access_token: accessToken,
          });

          setTransactions(transactions.data);
          setAccount(auth.data.numbers.ach[0]);
        } catch (error) {
          console.error(error);
        }
      }

      getAccessToken();
    }
  }, [publicToken]);

  useEffect(() => {
    async function getUserByEmail() {
      const userEmail = user?.emailAddresses[0].emailAddress;

      if (userEmail) {
        try {
          const response = await axios.get(
            "http://127.0.0.1:5000/api/getUserByEmail",
            {
              params: { email: userEmail },
            }
          );
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    getUserByEmail();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken || null,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
    },
  });

  return publicToken ? (
    <PlaidAuth
      publicToken={publicToken}
      account={account}
      transactions={transactions}
      tableUsers={users}
    />
  ) : (
    <button onClick={() => open()} disabled={!ready}>
      Open Link and connect your bank!
    </button>
  );
}
