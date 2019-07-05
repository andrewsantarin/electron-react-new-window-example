import React from 'react';


export type AddDetachableWindowButtonProps = {
  onAddClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text?: React.ReactNode;
};

export const AddDetachableWindowButton = ({ onAddClick, text }: AddDetachableWindowButtonProps) => {
  return (
    <button
      className="App-button"
      onClick={onAddClick}
    >
      {text}
    </button>
  )
}
