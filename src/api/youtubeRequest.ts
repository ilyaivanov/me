export const findYoutubeVideos = (
  term: string,
  pageToken?: string
): Promise<any> => {
  if (process.env.NODE_ENV === "test")
    throw new Error("Tried to execute real API call from tests");
  else {
    let url = `https://europe-west1-lean-watch.cloudfunctions.net/getVideos?q=${term}`;
    if (pageToken) url += `&pageToken=${pageToken}`;
    return fetch(url).then((res) => res.json());
  }
};

export const fetchPlaylistVideos = (
  playlistId: string,
  pageToken?: string
): Promise<any> => {
  if (process.env.NODE_ENV === "test")
    throw new Error("Tried to execute real API call from tests");
  else {
    let url = `https://europe-west1-lean-watch.cloudfunctions.net/getPlaylistItems?playlistId=${playlistId}`;

    if (pageToken) url += `&pageToken=${pageToken}`;
    return fetch(url).then((res) => res.json());
  }
};


export const findSimilarYoutubeVideos  = (videoId: string, pageToken?: string) => {
  let url = `https://europe-west1-lean-watch.cloudfunctions.net/getVideos?relatedToVideoId=${videoId}&type=video`;

    if (pageToken) url += `&pageToken=${pageToken}`;
    return fetch(url).then((res) => res.json());
}