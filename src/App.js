import { useEffect, useRef, useState } from 'react';
import { SongList } from './components/SongList';
import spotify from './lib/spotify';
import { Player } from './components/Player';
import { SearchInput } from './components/SearchInput';
import { Pagination } from './components/Pagination';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [searchItem, setSearchItem] = useState('');
  const [searchedSong, setSearchedSong] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const audioRef = useRef(null);
  const isSearchedSongs = searchedSong != null;
  const limit = 20;

  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };

  const searchedSongs = async (page) => {
    setIsLoading(true);
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    const result = await spotify.searchSongs(searchItem, limit, offset);
    setSearchedSong(result.items);
    setHasPrev(result.previous != null);
    setHasNext(result.next != null);
    setIsLoading(false);
  };

  const handleSongSelected = async (song) => {
    // 選択した音楽の再生状態を管理する
    setSelectedSong(song);
    if (song.preview_url != null) {
      audioRef.current.src = song.preview_url;
      audioRef.current.play();
      playSong();
    } else {
      pauseSong();
    }
  };

  const handleSearchedSong = (e) => {
    setSearchItem(e.target.value);
  };

  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };

  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const moveToNext = async () => {
    const nextPage = currentPage + 1;
    await searchedSongs(nextPage);
    setCurrentPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = currentPage - 1;
    await searchedSongs(prevPage);
    setCurrentPage(prevPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput onSearch={handleSearchedSong} onSubmit={searchedSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedSongs ? 'Search Result' : 'Popular Songs'}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedSongs ? searchedSong : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedSongs && (
            <Pagination
              moveToNext={hasNext ? moveToNext : null}
              moveToPrev={hasPrev ? moveToPrev : null}
              currentPage={currentPage}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
        />
      )}
      <audio ref={audioRef} />
    </div>
  );
}
