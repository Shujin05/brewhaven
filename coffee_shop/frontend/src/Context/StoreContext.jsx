import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
export const StoreContext = createContext(null);
import axios from "axios"

const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token, setToken] = useState(""); 
    const [food_list, setFood_list] = useState([])
    
    const addToCart = async (itemId) =>{
        if(!cartItems[itemId])
        {
            setCartItems((prev)=>({...prev,[itemId]:1}));
            console.log(cartItems)
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        }
        if (token) {
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}})
        }
    }

    const removeFromCart = async (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1})); 
        if (token) {
            await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}})
        }
    }
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            let itemInfo = food_list.find((product) => product._id === item);
            totalAmount += itemInfo.price * cartItems[item];
          }
        }
        return totalAmount;
      }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFood_list(response.data.data)
    }

    useEffect(()=> {
        async function loadData() {
            await fetchFoodList(); 
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token")); 
            }
        }
        loadData(); 
    }, [])

    const placeOrder = (deliveryData) =>{

        console.log(deliveryData);
    }

    const contextValue = {
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        placeOrder, 
        fetchFoodList, 
        url, 
        token, 
        setToken, 
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
        )

}

export default StoreContextProvider;