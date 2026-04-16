import { IDropdownOption } from "@fluentui/react";

export interface IAsyncDropdownState {
  loading: boolean;
  options: IDropdownOption[];   // always array
  error?: string;               // optional
}