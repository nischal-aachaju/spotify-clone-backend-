import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const arr = {

    "uri":
      "https://ik.imagekit.io/fy96t9gbf/spotify/music/music1771253503026_wUu0t1QvZ",
    "title": "Feri Jaalma"
  }
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const musicRes = await axios.get(
          "http://localhost:3000/api/music/",
          { withCredentials: true }
        );
        console.log(musicRes.data.music);
        
        const albumRes = await axios.get(
          "http://localhost:3000/api/music/album",
          { withCredentials: true }
        );

        setMusics(musicRes.data.music || [arr]);
        setAlbums(albumRes.data.albums || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  console.log(musics);

  return (
    <div className="p-8">

      {/* 🎵 MUSIC SECTION */}
      <h2 className="text-2xl font-bold mb-4">Music</h2>
      <div className="grid grid-cols-3 gap-6 mb-10">
        {musics.map((music, idx) => (
          <div
            key={idx}
            className="border rounded p-4 shadow hover:shadow-lg"
          >
            <audio controls className="w-full h-20 object-cover mb-3" src={music.uri}>
              Your browser does not support the audio element.
            </audio>

            <h3 className="font-semibold">{music.title}</h3>
          </div>
        ))}
      </div>

      {/* 💿 ALBUM SECTION */}
      <h2 className="text-2xl font-bold mb-4">Albums</h2>
      <div className="grid grid-cols-3 gap-6">
        {albums.map((album) => (
          <div
            key={album._id}
            className="border rounded p-4 shadow hover:shadow-lg"
          >
            <h3 className="font-semibold text-lg mb-2">
              {album.title}
            </h3>

            <p className="text-sm mb-2">
              Total Songs: {album.musics?.length}
            </p>

            <p className="text-xs text-gray-500">
              Artist ID: {album.artist}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HomePage;
