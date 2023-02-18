import dotenv from "dotenv";
dotenv.config();

import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SANDBOX_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await plaidClient.linkTokenCreate({
      client_name: "Plaid Quickstart",
      country_codes: ["US"],
      language: "en",
      user: {
        client_user_id: "0",
      },
      redirect_uri: "http://localhost:3000/plaid/",
      products: ["transactions"],
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error });
  }
}
