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
      <h1 className="mb-6 text-2xl font-semibold text-gray-200">Update Request</h1>
      <div className="rounded-2xl border border-gray-200 bg-white text-gray-800 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-6 items-center">
            <label htmlFor="name" className="w-32">Name:</label>
            <input
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-6 items-center">
            <label htmlFor="carType" className="w-32">Car Type:</label>
            <input
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              type="text"
              id="carType"
              name="carType"
              value={formData.carDetails.carType}
              onChange={handleCarDetailsChange}
              required
            />
          </div>

          <div className="flex gap-6 items-center">
            <label htmlFor="carModel" className="w-32">Car Model:</label>
            <input
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              type="text"
              id="carModel"
              name="carModel"
              value={formData.carDetails.carModel}
              onChange={handleCarDetailsChange}
              required
            />
          </div>

          <div className="flex gap-6 items-center">
            <label htmlFor="carMade" className="w-32">Car Made:</label>
            <input
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              type="text"
              id="carMade"
              name="carMade"
              value={formData.carDetails.carMade}
              onChange={handleCarDetailsChange}
              required
            />
          </div>

          <div className="flex gap-6 items-center">
            <label htmlFor="carYear" className="w-32">Car Year:</label>
            <input
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              type="text"
              id="carYear"
              name="carYear"
              value={formData.carDetails.carYear}
              onChange={handleCarDetailsChange}
              required
            />
          </div>

          <div className="flex gap-6 items-center">
            <label htmlFor="image" className="w-32">Image:</label>
            <input
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-6">
            <label htmlFor="description" className="w-32">Description:</label>
            <textarea
              className="flex-1 rounded-2xl border border-gray-200 p-2 shadow-sm"
              name="description"
              id="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )   
}

export default EditRequest