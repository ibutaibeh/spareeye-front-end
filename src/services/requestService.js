const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

// GET ALL
const loadReqeusts = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// GET ONE
const getRequest = async (requestID) => {
  try {
    const res = await fetch(`${BASE_URL}/${requestID}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// CREATE
const createRequest = async (requestFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// UPDATE
async function updateRequest(requestId, requestFormData) {
  try {
    const res = await fetch(`${BASE_URL}/${requestId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

// DELETE
const deleteRequest = async (requestId) => {
  try {
    const res = await fetch(`${BASE_URL}/${requestId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};


export {
  loadReqeusts, // GET ALL
  getRequest, // GET ONE
  createRequest, // CREATE
  deleteRequest, // DELETE ON
  updateRequest, // UPDATE ONE
};