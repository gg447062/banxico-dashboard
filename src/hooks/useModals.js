import { useState } from 'react';

export function useModals(modalName = '') {
  const [state, setState] = useState({
    [modalName]: false,
  });

  function openModal() {
    setState({
      ...state,
      [modalName]: true,
    });
  }

  function closeModal() {
    setState({
      ...state,
      [modalName]: false,
    });
  }

  return [openModal, closeModal, state[modalName]];
}
