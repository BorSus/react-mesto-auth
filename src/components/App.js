import React, { useEffect, useState, useCallback } from 'react';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api.js';
import { FormValidator } from '../utils/FormValidator.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function App() {
  //переменная состояния = данные пользователя
  const [currentUser, setСurrentUser] = useState({});
  //переменная состояния = данные карточки с сервера
  const [cards, setCards] = useState([]);
  //переменная состояния = Статус ProfilePopup
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  //переменная состояния = Статус AddPlacePopup
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  //переменная состояния = Статус EditAvatarPopup
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  //переменная состояния = Статус ConfirmPopup
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  //переменная состояния = Статус selectedCard
  const [selectedCard, setSelectedCard] = useState({});
  //переменная состояния = Статус deletedCard
  const [deletedCard, setDeletedCard] = useState({});
  //переменная состояния = Статус загрузки на сервер
  const [isLoad, setIsLoad] = useState(false);
  //переменная функции колбек содержит логику закрытия попапа клавишей Esc
  const closeByEscape = useCallback(evt => {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  }, []);

  //Функция открыть popupFullImg.
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  //Функция открыть popupPlace добавления новой карточки
  function handleAddPlaceClick() {
    formValidatorList['popupPlace'].resetValidation();
    setIsAddPlacePopupOpen(true);
  }
  //Функция открыть PopupProfile редактирование информации о пользователе
  function handleEditProfileClick() {
    formValidatorList['popupProfile'].resetValidation();
    setIsEditProfilePopupOpen(true);
  }
  //Функция открыть popupAvatar редактирование аватара
  function handleEditAvatarClick() {
    formValidatorList['popupAvatar'].resetValidation();
    setIsEditAvatarPopupOpen(true);
  }
  //Открыть PopupWithConfirmation подтверждение удаления карточки
  function handleDeleteIconClick(card) {
    setDeletedCard(card);
    formValidatorList['popupConfirm'].resetValidation();
    setIsConfirmPopupOpen(true);
  }
  //Функция закрытие всех попапов

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
    setDeletedCard({});
  }
  //Функция закрытие всех попапов по клику на оверлей
  function closePopupOnOverlayClick(event) {
    if (event.target === event.currentTarget) {
      closeAllPopups();
    }
  }

  //переменная  открыт ли какой-либо popup
  const isOpenAnyPopup =
    setIsEditProfilePopupOpen ||
    setIsAddPlacePopupOpen ||
    setIsEditAvatarPopupOpen ||
    setIsConfirmPopupOpen ||
    setSelectedCard.name;
  //На первой итерации он добавляем обработчик события нажатия клавиши Escape на документ только в том случае, если попап открыт
  useEffect(() => {
    if (isOpenAnyPopup) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isOpenAnyPopup, closeByEscape]);
  //Получение данных о пользователе и карточек с сервера, обновить стейт cards и сurrentUser
  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, cards]) => {
        setСurrentUser(userInfo);
        setCards(cards);
      })
      .catch(error => {
        console.error(`Ошибка при добавлении данных сервера: ${error}`);
      })
      .finally(() => {
        console.info('Добавление данных с сервера-завершено');
      });
  }, []);
  //Функция поставить||удалить like, обновить стейт cards
  async function handleCardLike(card) {
    try {
      // Снова проверяем, есть ли уже лайк на этой карточке
      const isLiked = card.likes.some(like => like._id === currentUser._id);
      const response = await api.changeLikeCardStatus(card._id, !isLiked);
      //console.log(response);
      setCards(state =>
        state.map(stateCard => (stateCard._id === card._id ? response : stateCard))
      );
    } catch (error) {
      console.error(`Ошибка при установка|удаления лайка карточки на странице: ${error}`);
    } finally {
      console.info('установка|удаление лайка карточки на странице-завершено');
    }
  }
  //Функция для submit формы AddPlace. добавить новую карточку на сервер,обновить стейт cards  и закрыть все модальные окна
  async function handleAddPlaceSubmit(newCardData) {
    try {
      setIsLoad(true);
      const response = await api.postNewCard(newCardData);
      setCards([response, ...cards]);
      closeAllPopups();
    } catch (error) {
      console.error(`Ошибка при добавлении новой карточки: ${error}`);
    } finally {
      setIsLoad(false);
      console.info('Добавление новой карточки-завершено');
    }
  }
  //Функция для submit формы Profile.сохранить изменения данных пользователя на сервере,обновить стейт currentUser  и закрыть все модальные окна
  async function handleUpdateUser(profileData) {
    try {
      setIsLoad(true);
      const response = await api.patchUserInfo(profileData);
      setСurrentUser(response);
      closeAllPopups();
    } catch (error) {
      console.error(`Ошибка при редактировании данных пользователя: ${error}`);
    } finally {
      setIsLoad(false);
      console.info('Редактирование данных пользователя-завершено');
    }
  }
  //Функция для submit формы Avatar.сохранить изменения аватара, обновить стейт currentUser  и закрыть все модальные окна
  async function handleUpdateAvatar(avatar) {
    try {
      setIsLoad(true);
      const response = await api.patchUserAvatar(avatar);
      setСurrentUser(response);
      closeAllPopups();
    } catch (error) {
      console.error(`Ошибка при редактировании аватара пользователя : ${error}`);
    } finally {
      setIsLoad(false);
      console.info('Редактирование аватара пользователя-завершено');
    }
  }

  //Функция для submit формы PopupWithConfirmation.удаления карточки, обновить стейт Cards  и закрыть все модальные окна
  async function handleConfirmDeleteCard(e) {
    try {
      setIsLoad(true);
      e.preventDefault();
      const response = await api.deleteCard(deletedCard._id);
      console.log(response);
      setCards(state => state.filter(stateCard => stateCard !== deletedCard));
      closeAllPopups();
    } catch (error) {
      console.error(`Ошибка при удалении карточки: ${error}`);
    } finally {
      setIsLoad(false);
      console.info(`Удаление карточки-завершено`);
    }
  }

  const [formValidatorList, setFormValidatorList] = useState({});
  useEffect(() => {
    const arrayPopupForm = Array.from(document.querySelectorAll('.popup__form'));
    const validators = {};
    arrayPopupForm.forEach(elementForm => {
      const instanceFormValidator = new FormValidator(elementForm);
      const formName = elementForm.getAttribute('name');
      validators[formName] = instanceFormValidator;
      instanceFormValidator.enableValidation();
    });
    setFormValidatorList(validators);
  }, []);
  //console.log(formValidatorList);
  /*
  //Добавление карточек на сервер
  useEffect(() => {
    const asyncFn = async () => {
      try {
        const response = await api.postCards();
        console.info(response);
      } catch (error) {
        console.error(`Ошибка при добавлении карточек на  сервер: ${error}`);
      } finally {
        console.info(`Добавление карточек на сервер-завершено`);
      }
    };
    asyncFn();
  }, []);
*/
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main
        cards={cards}
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onCardClick={handleCardClick}
        onIconDeleteClick={handleDeleteIconClick}
        onCardLike={handleCardLike}
      />
      <Footer />
      {/* === Popup редактирование профиля ===*/}
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoad={isLoad}
        handleOverlayPopupClick={closePopupOnOverlayClick}
      />
      {/* === Popup редактирование аватара ===*/}
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoad={isLoad}
        handleOverlayPopupClick={closePopupOnOverlayClick}
      />
      {/* === Popup добавление карточки ===*/}
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleAddPlaceSubmit}
        onAddPlace={handleAddPlaceSubmit}
        isLoad={isLoad}
        handleOverlayPopupClick={closePopupOnOverlayClick}
      />
      {/* === Popup подтверждения удаления карточки ===*/}
      <PopupWithForm
        namePopup="popupConfirm"
        popupTitle="Вы уверены?"
        textSubmitButton={isLoad ? 'Удаление...' : 'Да'}
        isOpen={isConfirmPopupOpen}
        onClose={closeAllPopups}
        onSubmit={handleConfirmDeleteCard}
        handleOverlayPopupClick={closePopupOnOverlayClick}
      ></PopupWithForm>

      <ImagePopup
        card={selectedCard}
        onClose={closeAllPopups}
        handleOverlayPopupClick={closePopupOnOverlayClick}
      />
    </CurrentUserContext.Provider>
  );
}
export default App;
