import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const arr = {
    uri: "https://ik.imagekit.io/fy96t9gbf/spotify/music/music1771253503026_wUu0t1QvZ",
    title: "Feri Jaalma",
  };

  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const musicRes = await axios.get(
          "http://localhost:3000/api/music/",
          { withCredentials: true }
        );

        const albumRes = await axios.get(
          "http://localhost:3000/api/music/album",
          { withCredentials: true }
        );

        setMusics(musicRes.data.music || [arr]);
        setAlbums(albumRes.data.album || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 Fetch album by ID when clicked
  const handleAlbumClick = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/music/album/${id}`,
        { withCredentials: true }
      );
    
      
      setSelectedAlbum(res.data.music);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <div className="p-8">

      {/* 🎵 MUSIC SECTION */}
      <h2 className="text-2xl font-bold mb-4">Music</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {musics.map((music, idx) => (
          <div
            key={idx}
            className="border rounded shrink-0 h-30 w-80 sm:w-70 md:w-80 p-4 shadow hover:shadow-lg"
          >
            <audio
              controls
              className="w-full mb-3"
              src={music.uri}
            />

            <h3 className="font-semibold">{music.title}</h3>
          </div>
        ))}
      </div>

      {/* 💿 ALBUM SECTION */}
      <h2 className="text-2xl font-bold mb-6">Albums</h2>

      <div className="grid grid-cols-3 gap-6 mb-10">
        {albums.map((album) => (
          <div
            key={album._id}
            onClick={() => handleAlbumClick(album._id)}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold">
              {album.title}
            </h3>

            <p className="text-gray-600 text-sm mt-2">
              Artist: {album.artist?.username}
            </p>
          </div>
        ))}
      </div>

      {/* 🎧 SELECTED ALBUM DETAILS */}
      {selectedAlbum && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedAlbum.title} Songs
          </h2>

          <p className="text-gray-600 mb-4">
            Artist: {selectedAlbum.artist?.username}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {selectedAlbum.musics?.map((music) => (
              <div
                key={music._id}
                className="border rounded p-4 shadow"
              >
                <audio
                  controls
                  className="w-full mb-3"
                  src={music.uri}
                />

                <h3 className="font-semibold">
                  {music.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
