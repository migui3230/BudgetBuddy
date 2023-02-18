import { plaidClient } from "./create-link-token";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // TODO: fix publicToken undefined
    const publicToken = req.body.public_token;
    // console.log("publicToken", publicToken);

    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = plaidResponse.data.access_token;
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(400).json({ error });
  }
}
