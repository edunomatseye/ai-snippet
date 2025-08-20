import { createBrowserRouter } from "react-router";

import { App, Index } from "./routes/App";

async function fetchTeam(teamId: string) {
  return {
    id: teamId,
    name: "Edun",
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Index,
  },
  {
    path: "/app",
    Component: App,
  },
  {
    path: "/team/:teamId",
    loader: async ({ params }) => {
      if (!params?.teamId) {
        throw new Error("Team ID is required");
      }
      const team = await fetchTeam(params.teamId);
      return { name: team.name };
    },
    Component: Index,
  },
]);
