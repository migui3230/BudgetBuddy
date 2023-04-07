import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { useUser } from "@clerk/nextjs";

type UserData = {
  email: string;
  role: "user" | "pro" | "admin";
  id: number;
};

type UsersData = UserData[];

type PlaidAuthProps = {
  publicToken: string;
  account: any;
  transactions: any;
  tableUsers: UsersData;
};

const PlaidAuth = ({
  publicToken,
  account,
  transactions,
  tableUsers,
}: PlaidAuthProps) => {
  // console.log(users);

  // filter for the specific user based on the clerk email
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  const filteredUser = tableUsers.filter(
    (user: UserData) => user.email === userEmail
  );

  const userRole = filteredUser[0].role;

  if (userRole === "user") {
    // only render one account from the plaid api
  } else if (userRole === "pro") {
    // render all accounts from the plaid api
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

export default function Plaid() {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState<string | undefined>();
  const [account, setAccount] = useState();
  const [accessToken, setAccessToken] = useState();
  const [transactions, setTransactions] = useState();
  const [users, setUsers] = useState();

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
          const usersFromTable = await axios.get(
            "http://127.0.0.1:5000/api/getUsers"
          );
          setUsers(usersFromTable.data);
        } catch (error) {
          console.error(error);
        }
      }

      getAccessToken();
    }
  }, [publicToken]);

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
