import { useEffect, useState, createContext } from "react";
import axios from "axios";

export const ApiDataContext = createContext();

const ContextApi = (props) => {
    const [api, setApi] = useState([]);
    useEffect(() => {
        const ApiCall = async () => {
            const response = await axios.get('http://localhost:3000/');
            setApi(response.data);
        };
        ApiCall();
    }, []);

    return (
        <div>
            <ApiDataContext.Provider value={api}>
                {props.children}
            </ApiDataContext.Provider>
        </div>
    );
};

export default ContextApi;
