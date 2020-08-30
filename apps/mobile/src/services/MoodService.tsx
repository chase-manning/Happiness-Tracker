import Mood from "../models/mood";

// TODO Move to some global location
const api: string =
  "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/";

const route: string = api + "moods";

const MoodService = {
  async createMood(mood: Mood): Promise<any> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: mood.string,
    };
    try {
      return await fetch(route, requestOptions);
    } catch {
      return null;
    }
  },

  async getMoods(): Promise<any> {
    try {
      return await fetch(route + "?" + "order=date" + "&" + "limit=20");
    } catch {
      return null;
    }
  },

  async deleteMood(moodId: string): Promise<any> {
    const requestOptions = {
      method: "DELETE",
    };
    try {
      return await fetch(route + "/" + moodId, requestOptions);
    } catch {
      return null;
    }
  },
};

export default MoodService;
