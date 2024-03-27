"use client";
import BigNumber from 'bignumber.js';

export function Input(props: any) {
  const { onChange, isNumber, groupSymbolLeft, groupSymbolRight, isPercent, ...otherProps } = props;

  function onChangeInput(event: any) {
    const { value } = event.target;

    if (isPercent)
      onChange(BigNumber(value).div(100));
    else if (props.type === 'number')
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
