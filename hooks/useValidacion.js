import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [values, setValues] = useState(stateInicial);
  const [errors, setErrors] = useState({});
  const [submitForm, setSubmitForms] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrors = Object.keys(errors).length === 0;

      if (noErrors) {
        fn();
      }
      setSubmitForms(true);
    }
  }, [errors]);

  // Funcion que se ejecuta conforme el usuario escribe algo
  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  // Funcion que se ejecuta cuando el usuario hace submit
  const handleSubmit = e => {
    e.preventDefault();
    const erroresValidacion = validar(values);
    setErrors(erroresValidacion);
    setSubmitForms(true);
  };

  const handleBlur = () => {
    const erroresValidacion = validar(values);
    setErrors(erroresValidacion);
  };

  return {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur
  };
};

export default useValidacion;
