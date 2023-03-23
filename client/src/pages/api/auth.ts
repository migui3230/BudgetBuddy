import { plaidClient } from "./create-link-token";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthGetRequest } from "plaid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const accessToken = req.body.access_token;
    // console.log("accessToken", accessToken);

    const plaidResponse = await plaidClient.authGet({
      access_token: accessToken,
    } as AuthGetRequest);
    res.status(200).json(plaidResponse.data);
  } catch (error) {
    res.status(400).json({ error });
  }
}
