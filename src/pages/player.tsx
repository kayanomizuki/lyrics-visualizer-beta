import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";
import { lazy, Suspense, useEffect, useState } from "react";

import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import isAccessTokenObject, {
  isRefreshedAccessTokenObject,
} from "@/types/typeGuards";
import { fetchAccessToken, fetchRefreshedAccessToken } from "@/utils/api";

import styles from "../styles/Player.module.css";

const LyricsVisualizerRoot = lazy(
  () => import("@/components/LyricsVisualizerRoot/LyricsVisualizerRoot")
);

interface PlayerPageProps {
  existRefreshTokenCookie: boolean;
}

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async (
  ctx
) => {
  return {
    props: {
      existRefreshTokenCookie: nookies.get(ctx).refreshToken !== undefined,
    },
  };
};

const Player: NextPage<PlayerPageProps> = (props) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (props.existRefreshTokenCookie) {
      (async () => {
        const refreshedAccessTokenObject = await fetchRefreshedAccessToken();
        if (isRefreshedAccessTokenObject(refreshedAccessTokenObject)) {
          setAccessToken(refreshedAccessTokenObject.access_token);
          router.replace(router.pathname, "");
        }
      })();
    }
    if (router.query.code !== undefined) {
      (async () => {
        const accessTokenObject = await fetchAccessToken(
          String(router.query.code)
        );
        if (isAccessTokenObject(accessTokenObject)) {
          setAccessToken(accessTokenObject.access_token);
          router.replace(router.pathname, "");
        }
      })();
    } else {
      router.replace("/");
    }
  }, []);

  return (
    <div className={styles.Player}>
      {(() => {
        if (accessToken !== undefined) {
          return (
            <Suspense fallback={<LoadingScreen />}>
              <LyricsVisualizerRoot accessToken={accessToken} />
            </Suspense>
          );
        }
      })()}
    </div>
  );
};

export default Player;
