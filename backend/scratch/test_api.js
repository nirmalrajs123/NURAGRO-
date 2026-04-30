const testApi = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/nutrition');
    console.log('SUCCESS! Status:', res.status);
    const data = await res.json();
    console.log('Data length:', data.length);
  } catch (err) {
    console.error('FAILED! Message:', err.message);
  }
};

testApi();
