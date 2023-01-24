
import { useEffect, useState } from 'react';
import './App.css';
import Current from './Components/Current'
import Forecast from './Components/Forecast'
const autoCompleteURL = "https://api.weatherapi.com/v1/search.json?key=430b7915cd8b434ea5e160157232301&q="
const weatherURL =(city)=>`https://api.weatherapi.com/v1/forecast.json?key=430b7915cd8b434ea5e160157232301&q=${city}&days=7&aqi=no&alerts=no
`;  

function App() {
  
  const [city, setCity] = useState('')
  const [clicked, setClicked] = useState(false)
  const[current,setCurrent]=useState();
  const[ forecast,setForecast]=useState();
const[location, setLocation]=useState('')
  const [citySuggestion, setCitySuggestion] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const handleClick = async(clickedCity) => {
    setCity(clickedCity)
    setClicked([true]);
    const resp = await fetch(weatherURL(city));
    const data = await resp.json();
    console.log(data)
    setCurrent(data.current);
    setForecast(data.forecast);
    setLocation(data.location.name)
  }
  useEffect(() => {
    const getDataAfterTimeout= setTimeout(()=>{
      const fetchCitySuggestion = async () => {
        const resp = await fetch(autoCompleteURL + city);
        const data = await resp.json();
        const citySuggestionData = data.map(curData => `${curData.name},${curData.region},${curData.country}`)
        setCitySuggestion(citySuggestionData)
      }
      if (!clicked && city.length > 2) {
        fetchCitySuggestion();
      } else {
        setCitySuggestion([])
        setClicked(false)
      }
  
  
   

    },1000);
    return()=>clearTimeout(getDataAfterTimeout)
  }, [city])
    
  
  return (
    <div className="App">
      <div className='header'><b>Sathiya Weather Report</b>
      </div>
      <div className='App-header'>
        <input
          type="text"
          className='citytextbox'
          placeholder='Enter the city name'
          value={city}
          onChange={(event) => setCity(event.target.value)} />
        {
          citySuggestion.length > 0 && (
            <div className='suggestionWrapper'>
              {citySuggestion.map(curCity => (
                <div className='suggestion' onClick={() => handleClick(curCity)}>
                  {curCity}
                </div>
              ))}
            </div>
          )}
          {
            current && <Current current={current} city={location}/>}
          {
            forecast && <Forecast forecast={forecast} city={location}/>
          }
      </div>
      </div>
  );
}

export default App;
