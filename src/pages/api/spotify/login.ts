import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

import {
  SPOTIFY_AUTHORIZE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
} from "../../../utils/constants";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const redirectParams = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: encodeURIComponent(SPOTIFY_SCOPES.join(" ")),
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });

    const url = `${SPOTIFY_AUTHORIZE_URL}?${redirectParams.toString()}`;
    res.redirect(url);
  } else {
    res.status(405).end();
  }
}
