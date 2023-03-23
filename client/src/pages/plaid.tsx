import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";

type PlaidAuthProps = {
  publicToken: string;
};

const PlaidAuth = ({ publicToken }: PlaidAuthProps) => {
  const [account, setAccount] = useState();
  const [accessToken, setAccessToken] = useState();
  const [transactions, setTransactions] = useState();

  useEffect(() => {
    async function getAccessToken() {
      try {
        const response = await axios.post("/api/exchange-public-token", {
          public_token: publicToken,
        });
        // wait 1 second for the api to respond
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // console.log("RESPONSE", response);

        const accessToken = response.data.accessToken;
        setAccessToken(accessToken);
        // console.log("ACCESS TOKEN", accessToken);

        const auth = await axios.post("/api/auth", {
          access_token: accessToken,
        });

        // ? this gives me balance info but no transaction
        const transactions = await axios.post("/api/transactions", {
          access_token: accessToken,
        });

        // console.log("TRANSACTIONS", transactions.data);

        setTransactions(transactions.data);

        setAccount(auth.data.numbers.ach[0]);
      } catch (error) {
        console.error(error);
      }
    }

    getAccessToken();
  }, [publicToken]);

  return account ? (
    <>
      <p>Account number: {account.account}</p>
      <p>Routing number: {account.routing}</p>
      <p>Account info: {transactions.accounts[0].account_id} </p>
    </>
  ) : (
    <p>failed api request</p>
  );
};

export default function Plaid() {
  // i am getting state into these
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState<string | undefined>();

  useEffect(() => {
    async function getLinkToken() {
      const res = await axios.get("/api/create-link-token");
      // console.log("RES", res);

      setLinkToken(res.data.link_token);
    }
    getLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken || null,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
    },
  });

  return publicToken ? (
    <PlaidAuth publicToken={publicToken} />
  ) : (
    <button onClick={() => open()} disabled={!ready}>
      Open Link and connect your bank!
    </button>
  );
}
