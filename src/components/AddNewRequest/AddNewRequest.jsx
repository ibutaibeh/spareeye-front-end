import { useState } from 'react'
import axios from "axios";

const AddNewRequest = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [voiceMode, setVoiceMode] = useState("none");
  const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <>
    <form>
<label htmlFor="date">Date :</label>



    </form>




    
    </>
  )
}

export default AddNewRequest