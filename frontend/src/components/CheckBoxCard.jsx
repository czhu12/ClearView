import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../styles/Form.module.css'

const CheckboxCard = ({
  id = `checkbox-${Date.now()}-${Math.floor(Math.random() * 100)}`,
  name,
  label,
  checked,
  onChange,
  radio,
  className,
  ariaLabel,
  value = false,
  autoFocus = false,
  subKey = false,
  icon = false,
  img = false,
  imgAlt,
  children = null,
  reducedMargin = false,
  style = {},
}) => {
  const inputProps = { id, checked, autoFocus, name };
  if (value) inputProps.value = value;
  return (
    <div
      className={`${styles["checkbox-container"]} flex align-items-center ${
        reducedMargin ? 'mb-2' : 'mb-3'
      }`}
      style={style}
    >
      {subKey && <span className={`fw-lighter ${styles.subkey}`}>L</span>}
      <label
        htmlFor={id}
        className={`${styles["checkbox-card"]} flex form-check ${
          radio && 'form-check-rounded'
        } radio-has-check justify-content-start align-items-center ${
          checked && 'checked'
        } ${subKey && 'ms-2'} ${className}`}
      >
        <input
          type={radio ? 'radio' : 'checkbox'}
          data-test-hook={name}
          aria-label={ariaLabel}
          onChange={(e) => {
            const checked = e.target.value === 'on';
            onChange(checked);
          }}
          className="form-check-input m-0"
          {...inputProps}
        />
        {children ? (
          children
        ) : (
          <React.Fragment>
            <label className="form-check-label m-0" htmlFor={id}>
              {label}
            </label>
            {icon && <FontAwesomeIcon icon={icon} />}
            {img && <img alt={imgAlt} src={img} />}
          </React.Fragment>
        )}
      </label>
    </div>
  );
};

export default CheckboxCard;
