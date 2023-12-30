import { AuthHandler, GithubAdapter, Session, useSession } from "sst/node/auth";
// import { StaticSite } from "sst/node/site";
import { Config } from "sst/node/config";
import { User } from "@git-tracker/core/user";
import { ApiHandler, Response } from "sst/node/api";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
}

export const handler = AuthHandler({
  providers: {
    github: GithubAdapter({
      clientID: Config.GITHUB_CLIENT_ID,
      clientSecret: Config.GITHUB_CLIENT_SECRET,
      scope: "read:user user:email",
      onSuccess: async (tokenset) => {
        // We cannot use tokenset.claims() it's only available for OIDC providers like google;
        // While Github does not supported that's why we needed to fetch the data from their API.
        // Result of tokenset: { access_token: string, token_type: 'bearer', scope: 'read:user, read:email' }
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokenset.access_token}`,
          },
        });
        const githubUser = (await response.json()) as {
          id: number;
          email: string;
          avatar_url: string;
          name: string;
        };

        const userExist = await User.findByEmail(githubUser.email);
        // const redirect = process.env.IS_LOCAL
        //   ? "http://localhost:5173/oauth/github"
        //   : `${StaticSite.Site.url}/oauth/github`;
        const redirect = "http://localhost:5173/oauth/github";

        if (!userExist) {
          const user = await User.create({
            name: githubUser.name,
            email: githubUser.email,
            avatar_url: githubUser.avatar_url,
            provider_id: githubUser.id,
          });

          return Session.parameter({
            redirect,
            type: "user",
            properties: {
              userID: user.id.toString(),
            },
          });
        }

        return Session.parameter({
          redirect,
          type: "user",
          properties: {
            userID: userExist.id.toString(),
          },
        });
      },
    }),
  },
});

export const session = ApiHandler(async () => {
  const session = useSession();

  if (session.type !== "user") {
    throw new Response({
      statusCode: 401,
      body: "Unauthorized",
    });
  }

  const user = User.findById(session.properties.userID);

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
});
