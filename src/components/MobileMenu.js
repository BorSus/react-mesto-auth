import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
function MobileMenu({ email, onExit, isMobileMenuActive }) {
  const navigate = useNavigate();
  //Функция выйти из аккаунта - удалить токен из локального хранилища,обновить стейт IsLoggedIn, перейти на страницу входа
  function exit() {
    onExit();
    localStorage.removeItem('jwt');
    navigate('/sign-in');
  }
  return (
    <div className={`mobile-menu ${isMobileMenuActive && `mobile-menu_active`}`}>
      <p className="mobile-menu__info">{email}</p>
      <Link to="/sign-in" className="mobile-menu__link" onClick={exit}>
        Выйти
      </Link>
    </div>
  );
}
export default MobileMenu;
