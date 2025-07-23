"use client"
import { useState,useRef, useCallback, useEffect} from "react";
export default function Home() {
  const toCurrencyRef = useRef(null)
  const fromCurrencyRef = useRef(null)
  const [exchangeRate,setExchangeRate]  = useState(0)
  const [currency1,setCurrency1] = useState("")
  const [currency2,setCurrency2] = useState("")

  const onSubmit = useCallback(()=>{
    const fromCurrency  = fromCurrencyRef.current.value
    const toCurrency = toCurrencyRef.current.value
    setCurrency1(fromCurrencyRef.current.value)
    setCurrency2(toCurrencyRef.current.value)


    const apiKey = process.env.NEXT_PUBLIC_CURRENCY_API_KEY;
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=${toCurrency}&base_currency=${fromCurrency}`;

    async function data(){
       try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        setExchangeRate(data.data[toCurrency].value)
       }catch (error){
        console.error("API error:", error);
       }
    }

    data()

  },[toCurrencyRef,fromCurrencyRef])


  // Making dropdown menu
  const [currencies,setCurrencies] = useState([])
  

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
        <h3 className="font-bold text-[15px] mt-[18px] mx-[359px]">Live Exchange Rate</h3>

        { /*DropDown Menu */}

        <div className="mb-[150px]">
          <h3 className="font-medium mx-5">From</h3>
          <select
          className="border border-[#DEDDDD] border-[2.5px]  rounded-[10px] mx-5 px-3 w-[200px] h-[40px] font-medium text-[17px]"
          ref = {fromCurrencyRef}
          >
            <option value="INR" onChange={(e)=>setCurrency1(e.current.value)}>INR</option>
            {currencies.map((currency) => (
              currency!=="INR" && (<option key={currency} value={currency}>
                {currency}
              </option>)
            ))}

          </select>
          <input 
            type="text"
            className="border border-[#DEDDDD] border-[2.5px] rounded-[10px]  placeholder-black p-2 w-[596px] h-[40px] text-[17px]"
            placeholder="0"
            value = {amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>

        <div className="mb-[116px]">
          <h3 className="font-medium mx-5">To</h3>
          <select
            className="border border-[#DEDDDD] border-[2.5px]  rounded-[10px] mx-5 px-3 w-[200px] h-[40px] font-medium text-[17px]"
            ref={toCurrencyRef}
            >
            <option value="USD">USD</option>
            {currencies.map((currency) => (
              currency!=="USD" && (<option key={currency} value={currency}>{currency}</option>)
            ))}
          </select>

          <input
            type="text"
            className="border border-[#DEDDDD] border-[2.5px] rounded-[10px]  placeholder-black p-2 w-[596px] h-[40px] text-[17px]"
            placeholder="toCountry"
            value={newValue}
            readOnly
            />
        </div>

        <div className="flex gap-[414px]">

          <div className="rounded-[10px] w-[180px] h-[55px] bg-[#DECBA4] mx-5 flex flex-col items-center">
            <h3 className="mt-1 text-[12px] font-medium text-[#3E5151]">Exchange Rate</h3>
            <p className="">1 {currency1} = {exchangeRate.toFixed(3)} {currency2}</p>
          </div>

          <input 
            type="submit"
            value="Convert"
            className="rounded-[10px] w-[180px] h-[55px]  mx-5 text-[20px] font-bold text-white bg-[#3E5151]"
            onClick={()=>onSubmit()}
            />
   

          

        </div>

      
    </div>
  </div>
  )
}
