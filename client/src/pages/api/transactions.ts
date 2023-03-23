import { NextApiRequest, NextApiResponse } from "next";
import { plaidClient } from "./create-link-token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.body.access_token;
  const response = await plaidClient.transactionsGet({
    access_token: accessToken,
    start_date: "2019-01-01",
    end_date: "2020-01-31",
  });

  res.status(200).json(response.data);
}
