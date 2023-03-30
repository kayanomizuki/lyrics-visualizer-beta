// Official Documentation: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
import {
  SPOTIFY_API_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "@/utils/constants";
import { RefreshedAccessTokenObject } from "@/types/type";

import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshedAccessTokenObject>
) {
  if (req.method === "GET") {
    const refreshToken = nookies.get(res).refreshToken;
    if (refreshToken !== undefined) {
      const response = await fetch(SPOTIFY_API_TOKEN_URL, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("response.ok:", response.ok);
            console.error("response.status:", response.status);
            console.error("response.statusText:", response.statusText);
            throw new Error(response.statusText);
          }
          //Response.OK(200-299)
          return response.json();
        })
        .catch((error) => {
          console.error("An error has occurred.", error);
          res.status(error.status).end();
        });
      res.status(200).send(response);
    } else {
      res.status(401).end();
    }
  } else {
    res.status(405).end();
  }
}
