import React, { FunctionComponent } from 'react';


export type IncrementalValueGroupProps = {
  value: number;
  onIncrementClick: () => void;
  onDecrementClick: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const IncrementalValueGroup = ({ value, onDecrementClick, onIncrementClick, onChange }: IncrementalValueGroupProps) => {
  return (
    <p className="App-input-group ">
      <label>
        <span className="label">Provide a value:</span>
        <input
          type="number"
          value={value}
          onChange={onChange}
        />
        <button onClick={onIncrementClick}>+</button>
        <button onClick={onDecrementClick}>-</button>
      </label>
    </p>
  );
}
