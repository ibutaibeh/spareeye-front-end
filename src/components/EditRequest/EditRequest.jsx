import {updateRequest,getRequest} from '../../services/requestService'
import { useState,useEffect,useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { useParams,Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const EditRequest = () => {
// const [req,setReq]= useState(null)
const {reqId}= useParams()
const {user}= useContext(UserContext)
const navigate = useNavigate();
const [formData,setFormData]=useState({
    name:'',
    carDetails:{
      carType:'',
      carModel:'',
      carMade:'',
      carYear:''
    },
    image:'',
    description:''
  })
useEffect(()=>{
    const fetchRequest = async()=>{
        const reqData= await getRequest(reqId)
        // setReq(reqData)
        setFormData(reqData)
    }
    fetchRequest()
},[reqId])

const {name,carDetails:{carType,carModel,carMade,carYear},image,description } = formData
  const handleChange =(evt)=>{ 
        setFormData({...formData, [evt.target.name]:evt.target.value})
    };
   const handleCarDetailsChange=(evt)=>{
    setFormData({
      ...formData, carDetails:{...formData.carDetails,[evt.target.name]:evt.target.value}
    })
   } 

   const handleSubmit = async (evt)=>{
  evt.preventDefault();
  if(!formData.owner==user._id){
    return;
  }
  await updateRequest(reqId,formData);
  navigate('/requests')

}

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-sans">
      <h1 className="mb-6 text-2xl font-semibold text-white-100">Update Request</h1>
        <div className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-4 shadow-sm">
          
          <form onSubmit={handleSubmit}>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="name">Name :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="name"
                 name="name"
                 value={formData.name}
                 onChange={handleChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carType">carType :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carType"
                 name="carType"
                 value={formData.carDetails.carType}
                 onChange={handleCarDetailsChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carModel">carModel :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carModel"
                 name="carModel"
                 value={formData.carDetails.carModel}
                 onChange={handleCarDetailsChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carMade">carMade :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carMade"
                 name="carMade"
                 value={formData.carDetails.carMade}
                 onChange={handleCarDetailsChange} required/>
            </div>
                        <div className=".gap-1 flex gap-10  ">
                <label htmlFor="carYear">carYear :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="carYear"
                 name="carYear"
                 value={formData.carDetails.carYear}
                 onChange={handleCarDetailsChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="image">image :</label>
                <input className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 type="text"
                 id="image"
                 name="image"
                 value={formData.image}
                 onChange={handleChange} required/>
            </div>
            <div className=".gap-1 flex gap-10  ">
                <label htmlFor="description">description :</label>
                <textarea className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-1 shadow-sm"
                 name="description"
                 id="description"
                 rows="8"
                 cols="35"
                 value={formData.description}
                 onChange={handleChange} required/>
            </div>
            <div className='.gap-1 flex gap-10'>
            <button>Update</button>
            <button onClick={()=>navigate('/requests')}>Cancel</button>
            </div>
          </form>
        </div>
        </div>   
  )
}

export default EditRequest