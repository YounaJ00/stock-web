import { use, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'; 
import PokeCard from './components/PokeCard';
import { useDebounce } from './hooks/useDebounce';


function App() {
  
  // a
  const [pokemons, setPokemons] = useState([]);
  // b. 포케몬 카드 더보기 기능
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  // c. 검색기능
  const [searchTerm, setSearchTerm] = useState("");

  // d. 디바운싱 hooks 가져오기
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {  // a
    fetchPokemonsData(true);
  }, [])

  useEffect(() => {
    handleSearchInput(debouncedSearchTerm)
  }, [debouncedSearchTerm])
  
  
  const fetchPokemonsData = async(isFirstFetch) => {
    try { // b
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url); 
      // console.log(response.data.results);
      setPokemons([...pokemons, ...response.data.results]);
      setOffset(offsetValue) 
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearchInput = async (searchTerm) => {
    
    if(searchTerm.length > 0) {
      try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
          const pokemonData = {
            url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
            name: searchTerm
          }
          setPokemons([pokemonData])
      } catch (error) {
        setPokemons([]);
        console.error(error);
      }
    }else {
      fetchPokemonsData(true);
    }
  }



  return ( 
    <article className='pt-6'>
      <header className='flex flex-col gap-2 w-full px-4 z-50'>
        <div className='relative z-50'>
        <form 
          className='relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto'>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='text-xs w-[20.5rem] h-6 px-2 py-1 bg-slate-900 bg-opacity-50 rounded-lg text-gray-200 text-center' 
            />
            
            <button
              type='submit'
              className='text-xs bg-slate-700 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-400'>
              검색
            </button>
        </form>
        </div>
      </header>
      <section className='pt-6 flex flex-col justify-center items-center'>
        <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl'>

          {pokemons.length > 0 ? 
          (
            pokemons.map(({url, name}, index) => (
                <PokeCard key={url} url={url} name={name}/>
            ))
          ) : 
          (
            <h2 className='font-medium text-lg text-slate-900 mb-1'>
              포켓몬이 없습니다!
            </h2>
          )}
        </div>
      </section>
      <div className='text-center'>
          <button
          onClick={() => fetchPokemonsData(false)}
            className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'>
            More
          </button>
      </div>
    </article>
  )
}

export default App
