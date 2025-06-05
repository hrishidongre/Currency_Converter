"use client"
import { useState,useRef, useCallback, useEffect} from "react";
export default function Home() {
  const toCurrencyRef = useRef(null)
  const fromCurrencyRef = useRef(null)
  const [exchangeRate,setExchangeRate]  = useState(0)

  const onSubmit = useCallback(()=>{
    const toCurrency = toCurrencyRef.current.value
    const fromCurrency  = fromCurrencyRef.current.value

    const apiKey = process.env.NEXT_PUBLIC_CURRENCY_API_KEY;
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=${toCurrency}&base_currency=${fromCurrency}`;

    async function data(){
       try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // console.log("API Response:", data);

        setExchangeRate(data.data[toCurrency].value)
       }catch (error){
        console.error("API error:", error);
       }
    }

    data()

  },[toCurrencyRef,fromCurrencyRef])



  // Making dropdown menu
  const [currencies,setCurrencies] = useState([])
  const [currency,setCurrency] = useState("INR")

  useEffect(()=>{
    const apiKey = process.env.NEXT_PUBLIC_CURRENCY_API_KEY
    async function fetchCountries(){
      const response = await fetch(`https://api.currencyapi.com/v3/currencies?apikey=${apiKey}&currencies=`)
      const currencyData = await response.json();

      const currencyCodes = Object.keys(currencyData.data)

      setCurrencies(currencyCodes)
    }
    fetchCountries()
    
  },[])

//   useEffect(() => {
//   console.log(currencies, "✅ updated list of currencies");

// }, [currencies]);

const [amount,setAmount] = useState("")
const [newPrice,setNewPrice] = useState("0.000")

useEffect(() => {
  if (amount && exchangeRate) {
    const price = parseFloat(amount);
    const rate = parseFloat(exchangeRate);

    if (!isNaN(price) && !isNaN(rate)) {
      setNewPrice((price * rate).toFixed(3));
    }
  }
}, [amount, exchangeRate]);


 useEffect(()=>{
    const apiKey = process.env.NEXT_PUBLIC_CURRENCY_API_KEY
    async function fetchCountries(){
      const response = await fetch(`https://api.currencyapi.com/v3/currencies?apikey=${apiKey}&currencies=`)
      const currencyData = await response.json();

      const currencyCodes = Object.keys(currencyData.data)

      setCurrencies(currencyCodes)
    }
    fetchCountries()
    setNewPrice(parseFloat(newPrice))
    
  },[])

  const newValue = parseFloat(newPrice).toFixed(3)




  

  return (
    <div className="min-h-screen w-screen  bg-[linear-gradient(to_bottom,_#FFFEF6_25%,_#FFFFFF_75%)] flex flex-col items-center gap-[72px]">

      <div className="flex flex-col items-center">
        <img 
          src="/Currency Converter.svg" 
          alt="heading"
          className="pt-[35px] px-[469.5px]"
        />
        <p className="text-[#717171] text-[17px] font-medium">Convert currencies with real-time exchange rates. Fast, accurate, and easy to use.</p>
      </div>

     

       { /*White Space*/}
      <div className="w-[892px] h-[570px] rounded-[10px] border border-black flex flex-col bg-white">

        { /*DropDown Menu */}

        <div>
          <select
          className="border border-black rounded m-5 p-2 w-[200px] h-[40px]"
          ref = {fromCurrencyRef}

          // onChange={(e) => {setCurrency(e.target.value)}}
          >
            <option value="INR">INR</option>
            {currencies.map((currency) => (
              currency!=="INR" && (<option key={currency} value={currency}>
                {currency}
              </option>)
            ))}

          </select>
          <input 
            type="text"
            className="border border-black rounded placeholder-gray-500  p-2 w-[596px] h-[40px]"
            placeholder="fromCountry"
            value = {amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>

        <div>
          <select
            className="border border-black rounded m-5 p-2 w-[200px] h-[40px]"
            ref={toCurrencyRef}

            // onChange={(e) => {setCurrency(e.target.value)}}
          >
            <option value="USD">USD</option>
            {currencies.map((currency) => (
              currency!=="USD" && (<option key={currency} value={currency}>{currency}</option>)
            ))}
          </select>
          <input
            type="text"
            className="border border-black  placeholder-gray-500 p-2 rounded w-[596px] h-[40px]"
            placeholder="toCountry"
            value={newValue}
            readOnly
          />
        </div>

      <input 
        type="submit"
        className="border border-black w-[200px] mb-5 mx-5"
        onClick={()=>
        {
          onSubmit();
          // convertedPrice();
        }
        }

      />
   

      <div className="border border-black w-[287px]  p-2 mx-5">
        <p>Rate: {exchangeRate.toFixed(3)}</p>
      </div>
      
      
    </div>
  </div>
  )
}
