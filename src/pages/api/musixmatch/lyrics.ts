import { MUSIXMATCH_LYRICS_API_URL } from "@/utils/constants";
import { LyricsObject } from "@/types/type";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LyricsObject>
) {
  if (req.method === "GET") {
    if (
      typeof req.query.trackid === "string" &&
      typeof req.query.accesstoken === "string"
    ) {
      const response = await fetch(
        `${MUSIXMATCH_LYRICS_API_URL}/?trackid=${req.query.trackid}&accesstoken=${req.query.accesstoken}`,
        {
          method: "GET",
          referrer: `${req.url}`,
          referrerPolicy: "strict-origin",
        }
      )
        .then((response) => {
          if (!response.ok) {
            if (response.status == 400) {
              res.status(400).end();
              return;
            }
            if (response.status == 404) {
              res.status(404).end();
              return;
            }
            console.error("response.ok:", response.ok);
            console.error("response.status:", response.status);
            console.error("response.statusText:", response.statusText);
            throw new Error(response.statusText);
          }
          //Response.OK(200-299)
          return response.json();
        })
        .catch((error) => {
          res.status(error.state).end();
          console.error("An error has occurred.", error);
          res.status(error.status).end();
        });
      res.status(200).send(response);
    } else {
      res.status(400).end();
    }
  } else {
    res.status(405).end();
  }
}
