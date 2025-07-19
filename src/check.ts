// check.ts
import { Router } from "express";
import axios from "axios";

const footballRoute = Router();

footballRoute.get("/api/football/teams", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.football-data.org/v4/competitions/PL/teams",
      {
        headers: {
          "X-Auth-Token": "8ed2a374d95c46a797a5ac55e7b37b6d"
        }
      }
    );
    const teams = response.data.teams
     const teamNames = teams.map((team: any) => team.name);
    res.json(teamNames);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

export default footballRoute;
