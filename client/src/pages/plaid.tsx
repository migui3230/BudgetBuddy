import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { useUser, UserButton } from "@clerk/nextjs";
import React from "react";
import { Select, Button } from "@mantine/core";

type Balance = {
  available: number;
  current: number;
  iso_currency_code: string;
  limit: null;
  unofficial_currency_code: null;
};

type Account = {
  account_id: string;
  balances: Balance;
  mask: string;
  name: string;
  official_name: string;
  subtype: string;
  type: string;
};

type Item = {
  available_products: string[];
  billed_products: string[];
  consent_expiration_time: null;
  error: null;
  institution_id: string;
  item_id: string;
  optional_products: null;
  products: string[];
  update_type: string;
  webhook: string;
};

type TransactionsResponse = {
  accounts: Account[];
  item: Item;
  request_id: string;
  total_transactions: number;
  transactions: any[]; // You can replace 'any' with a more specific type if you have information about the transaction objects
};

type UserData = {
  email: string;
  role: "user" | "pro" | "admin";
  id: number;
};

type PlaidAuthProps = {
  publicToken: string;
  account: any; // You can replace 'any' with a more specific type if you have information about the account objects
  transactions: TransactionsResponse;
  tableUsers: UserData;
};

const PlaidAuthComponent = ({
  publicToken,
  account,
  transactions,
  tableUsers: tableUser,
}: PlaidAuthProps) => {
  const { user } = useUser();

  const userRole = tableUser?.role;

  if (!account || !userRole) {
    return <p>loading...</p>;
  }

  if (userRole === "user") {
    const firstAccount = transactions.accounts[0];
    return (
      <>
        <p>Account ID: {firstAccount.account_id}</p>
        <p>Account number: {firstAccount.account_id}</p>
        <p>Current balance: {firstAccount.balances.current} </p>
        <p>Account name: {firstAccount.name} </p>
        <p>Account type: {firstAccount.subtype}</p>
      </>
    );
  } else if (userRole === "pro") {
    return (
      <>
        {transactions.accounts.map((account) => (
          <div key={account.account_id}>
            <p>Account ID: {account.account_id}</p>
            <p>Account number: {account.account_id}</p>
            <p>Current balance: {account.balances.current} </p>
            <p>Account name: {account.name} </p>
            <p>Account type: {account.subtype}</p>
          </div>
        ))}
      </>
    );
  }

  return <p>nothing</p>;
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
  }, [user]);

  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/getAllUsers"
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getAllUsers();
  }, []);

  const handleRoleChange = (
    newRole: "user" | "pro" | "admin",
    userId: number
  ) => {
    setAllUsers(
      allUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/updateUsers",
        allUsers.map(({ email, role }) => ({ email, role }))
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken || null,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
    },
  });

  // @ts-ignore
  const userRole = users?.role;

  const renderAdminContent = () => {
    return (
      <>
        <UserButton />
        {allUsers.map((user) => (
          <div key={user.id}>
            <p>Email: {user.email}</p>
            <Select
              value={user.role}
              data={[
                { value: "user", label: "User" },
                { value: "pro", label: "Pro" },
                { value: "admin", label: "Admin" },
              ]}
              onChange={(value: "user" | "pro" | "admin") =>
                handleRoleChange(value, user.id)
              }
            />
          </div>
        ))}
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </>
    );
  };

  const renderNonAdminContent = () => {
    return publicToken ? (
      <div style={{ 
        position: 'relative', 
        minHeight: '100vh',   
        minWidth: '100vw',
        backgroundColor: '#00ff7f',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

      }}>
        <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        fontSize: '64px', 
        fontWeight: 'bold', 
        margin: '2rem 0 1rem',
        textAlign: 'center' 
      }}>
        Budget Buddy
        <div style={{ fontSize: '24px', fontWeight: 'normal' }}>
          Your Partner in Financial Success
        </div>
      </div>
        <PlaidAuth
          publicToken={publicToken}
          account={account}
          transactions={transactions as unknown as TransactionsResponse}
          tableUsers={users as unknown as UserData}
        />
        <div style={{ position: 'absolute', top: '5px', right: '20px' }}>
          <UserButton style={{ fontSize: '24px', padding: '16px' }} />
        </div>
      </div>
    ) : (
      <div style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        minWidth: '100vw', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#00ff7f',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        }}>
        <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        fontSize: '64px', 
        fontWeight: 'bold', 
        margin: '2rem 0 1rem',
        textAlign: 'center' 
      }}>
        Budget Buddy
        <div style={{ fontSize: '24px', fontWeight: 'normal' }}>
          Your Partner in Financial Success
        </div>
      </div>
        <button 
          onClick={() => open()} 
          disabled={!ready} 
          style={{ 
            fontSize: '24px', 
            padding: '16px',
            backgroundColor: '#00bfff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer' 
            }}
        >
          Open Link and connect your bank!
        </button>
        <div style={{ position: 'absolute', top: '5px', right: '20px' }}>
          <UserButton style={{ fontSize: '24px', padding: '16px' }} />
        </div>
      </div>
    );
  };

  return userRole === "admin" ? renderAdminContent() : renderNonAdminContent();
}
