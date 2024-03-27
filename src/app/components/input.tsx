"use client";
import BigNumber from 'bignumber.js';

interface CustomProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  isNumber?: boolean,
  isPercent?: boolean,
  groupSymbolLeft?: string,
  groupSymbolRight?: string,
  onChange: React.Dispatch<React.SetStateAction<any>>
}

export function Input(props: CustomProps) {
  const { onChange, isNumber, groupSymbolLeft, groupSymbolRight, isPercent, ...otherProps } = props;

  function onChangeInput(event: any) {
    const { value } = event.target;

    if (isPercent)
      onChange(BigNumber(value).div(100));
    else if (props.type === 'number' || isNumber)
      onChange(BigNumber(value));

    else
      onChange(value);
  }

  const input = <input className="form-control" onChange={onChangeInput} {...otherProps} />;

  return groupSymbolLeft || groupSymbolRight ? (
    <div className="input-group mb-3">
      {groupSymbolLeft && <span className="input-group-text">{groupSymbolLeft}</span>}
      {input}
      {groupSymbolRight && <span className="input-group-text">{groupSymbolRight}</span>}
    </div>
  ) : input;
}
