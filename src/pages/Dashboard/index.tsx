import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // Desestruturando o item recebido como parâmetro
      const { name, image, price, description } = food;

      // Montagem do novo item, setando o Available como TRUE
      const newFood = {
        available: true,
        id: foods.length + 1,
        ...food,
      } as IFoodPlate;

      // Setando no state o novo item no array de itens
      setFoods([newFood, ...foods]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // Desestrutura o objeto
    const { name, image, price, description } = food;

    // Copia o array do state para um local
    const newFoodsArray = [...foods];

    // Encontra o item que estou editando dentro do array local
    const index = newFoodsArray.findIndex(
      searchFood => searchFood.id === editingFood.id,
    );

    // Altera o objeto encontrado no array
    newFoodsArray[index] = {
      id: editingFood.id,
      name,
      image,
      price,
      description,
    } as IFoodPlate;

    // Seta o state como o novo array, já com o objeto alterado
    setFoods(newFoodsArray);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // Filtro o array atual de foods no state e trago somente os que são diferentes do que eu mandei deletar
    const newFoods = foods.filter(food => food.id !== id);

    // Reseta o state com o novo array, sem que foi removido
    setFoods(newFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // Seta o objeto atual como sendo o de edição
    setEditingFood(food);

    // Abre o modal de edição
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
