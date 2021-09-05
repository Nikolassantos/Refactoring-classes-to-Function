import { InputHTMLAttributes } from 'react';
import { IconType } from 'react-icons';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: IconType;
}

export interface IInputContainerProps {
  isFilled: boolean;
  isFocused: boolean;
}
