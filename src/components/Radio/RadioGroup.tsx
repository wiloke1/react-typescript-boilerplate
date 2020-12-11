import useMergedState from 'hooks/useMergedState';
import React, { ChangeEvent, FC, InputHTMLAttributes, memo, ReactNode } from 'react';
import { ColorNames, Size, View } from 'wiloke-react-core';
import { classNames } from 'wiloke-react-core/utils';
import { RadioGroupActionProvider, RadioGroupStateProvider } from './context';
import Radio, { Value } from './Radio';
import styles from './Radio.module.scss';

export interface Optional {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Size cua tat ca Radio */
  size?: Size;
  /** Gia tri mac dinh duoc chon */
  defaultValue?: Value;
  /** Childrent Optional */
  options?: string[] | Optional[];
  /** html name cua chilren*/
  name?: InputHTMLAttributes<HTMLInputElement>['name'];
  /** Value */
  value?: Value;
  /** Disable tat ca radio */
  disabled?: boolean;
  /** Color khi active */
  activeColor?: ColorNames;
  /** Color text khi active radio button*/
  textActiveColor?: ColorNames;
  /**Children cua radio group*/
  children?: ReactNode;
  /** Block radio */
  block?: boolean;
  /** Màu border được lấy màu từ ThemeProvider */
  borderColor?: ColorNames;
  /** Su kien onChange */
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  /** Su kien onChange lay value */
  onChangeValue?: (value: string) => void;
}

const RadioGroup: FC<RadioGroupProps> = ({
  activeColor = 'primary',
  textActiveColor = 'light',
  size = 'medium',
  options,
  name,
  disabled,
  value,
  children,
  block = false,
  borderColor = 'gray5',
  defaultValue,
  onChange,
  onChangeValue,
}) => {
  const [valueState, setValueState] = useMergedState(String(defaultValue), {
    value: value,
  });
  const blockGroupClass = block ? styles.blockGroup : '';
  const classes = classNames(styles.groupContaner, blockGroupClass);

  const _handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const lastValue = valueState;
    const val = event.target.value;

    if (!value) {
      setValueState(val);
    }
    if (onChange && val !== lastValue) {
      onChange(event);
    }
    if (onChangeValue && val !== lastValue) {
      onChangeValue(val);
    }
  };

  const _renderGroup = () => {
    let childrenToRender = children;
    if (options && options.length > 0) {
      childrenToRender = (options as Array<string | Optional>).map(option => {
        if (typeof option === 'string') {
          return (
            <Radio size={size} key={option} disabled={disabled} value={option} checked={value === option}>
              {option}
            </Radio>
          );
        }
        return (
          <Radio size={size} key={option.value} disabled={option.disabled || disabled} value={option.value} checked={value === option.value}>
            {option.label}
          </Radio>
        );
      });
    }

    return (
      <View className={classes} borderColor={borderColor} tachyons="dib">
        {childrenToRender}
      </View>
    );
  };

  return (
    <RadioGroupStateProvider
      value={{
        value: valueState,
        disabled: disabled,
        name: name,
        size,
        activeColor,
        block,
        textActiveColor,
        borderColor,
      }}
    >
      <RadioGroupActionProvider value={_handleChange}>{_renderGroup()}</RadioGroupActionProvider>
    </RadioGroupStateProvider>
  );
};

export default memo(RadioGroup);
