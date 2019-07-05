import { useCallback, useState } from 'react';


export const useIncrementalValue = () => {  
  const [ value, setValue ] = useState(0);

  const changeValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(parseInt(event.currentTarget.value));
    },
    [
      setValue,
    ]
  );

  const incrementValue = useCallback(
    () => {
      setValue(value + 1);
    },
    [
      value,
      setValue,
    ]
  );

  const decrementValue = useCallback(
    () => {
      setValue(value - 1);
    },
    [
      value,
      setValue,
    ]
  );

  return {
    value,
    setValue,
    changeValue,
    incrementValue,
    decrementValue,
  };
}
