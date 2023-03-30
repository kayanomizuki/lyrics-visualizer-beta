// Official Documentation: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
import {
  SPOTIFY_API_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from "@/utils/constants";
import { AccessTokenObject } from "@/types/type";

import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccessTokenObject>
) {
  if (req.method === "GET") {
    if (typeof req.query.code === "string") {
      const code = String(req.query.code);

      const response = await fetch(SPOTIFY_API_TOKEN_URL, {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
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

      //set cookie(httpOnly)
      setCookie({ res }, "refreshToken", response.refresh_token, {
        maxAge: 864000,
        secure: !res.req.headers.host?.includes("localhost"),
        httpOnly: true,
        path: "/",
      });

      res.status(200).send(response);
    } else {
      res.status(400).end();
    }
  } else {
    res.status(405).end();
  }
}
