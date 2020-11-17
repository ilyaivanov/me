export const findYoutubeVideos = (term: string): Promise<any> => {
  if (process.env.NODE_ENV === "test")
    throw new Error("Tried to execute real API call from tests");
  else {
    const url = `https://europe-west1-lean-watch.cloudfunctions.net/getVideos?q=${term}`;
    return fetch(url).then((res) => res.json());
  }
};


