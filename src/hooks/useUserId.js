import { useState } from 'react';

const useUserId = () => {
  const [userId, setUserId] = useState(1);
  return [userId, setUserId];
};

export default useUserId;
