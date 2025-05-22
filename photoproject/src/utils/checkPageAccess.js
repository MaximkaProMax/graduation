import axios from 'axios';

export async function checkPageAccess(page, navigate, setIsAuthorized, setIsLoading) {
  try {
    const res = await axios.get('http://localhost:3001/api/access-control/check', {
      params: { page },
      withCredentials: true
    });
    if (res.data && res.data.allowed) {
      setIsAuthorized(true);
    } else {
      navigate('/');
    }
  } catch {
    navigate('/');
  } finally {
    setIsLoading(false);
  }
}
