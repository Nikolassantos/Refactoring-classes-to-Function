import React, { useEffect, useState } from 'react';
import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';
import { FoodsContainer } from './styles';
import { IModalValueProps } from './types';

function Dashboard() {
  const [modalInputValues, setModalInputValues] = useState<IModalValueProps>({
    foods: [],
    editingFood: {
      id: 0,
    },
    modalOpen: false,
    editModalOpen: false,
  });

  function initialFetch() {
    (async () => {
      const response = await api.get('/foods');

      setModalInputValues((state) => ({ ...state, foods: response.data }));
    })();
  }

  async function handleAddFood(food: any) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setModalInputValues((state) => ({ ...state, foods: response.data }));
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: any) {
    try {
      const foodUpdated = await api.put(
        `/foods/${modalInputValues.editingFood.id}`,
        {
          ...modalInputValues.editingFood,
          ...food,
        }
      );

      const foodsUpdated: any = modalInputValues.foods.map((f: any) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setModalInputValues((state) => ({ ...state, foods: foodsUpdated }));
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalInputValues((state) => ({
      ...state,
      modalOpen: !modalInputValues.modalOpen,
    }));
  }

  function toggleEditModal() {
    setModalInputValues((state) => ({
      ...state,
      editModalOpen: !modalInputValues.editModalOpen,
    }));
  }

  async function handleDeleteFood(id: any) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered: any = modalInputValues.foods.filter(
      (food: any) => food.id !== id
    );

    setModalInputValues((state) => ({ ...state, foods: foodsFiltered }));
  }

  function handleEditFood(food: any) {
    setModalInputValues((state) => ({
      ...state,
      editingFood: food,
      editModalOpen: true,
    }));
  }

  useEffect(initialFetch, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalInputValues.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalInputValues.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={modalInputValues.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {modalInputValues.foods &&
          modalInputValues.foods.map((food) => (
            <Food
              key={food.id as any}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
export default Dashboard;
