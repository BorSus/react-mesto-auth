import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
function NavigateBar({ email, onExit, onMobileMenuIcon, isMobileMenuActive, isMobileVersion }) {
  const navigate = useNavigate();
  const location = useLocation();
  //Функция выйти из аккаунта - удалить токен из локального хранилища,обновить стейт IsLoggedIn, перейти на страницу входа
  function exit() {
    onExit();
    localStorage.removeItem('jwt');
    navigate('/sign-in');
  }
  return (
    <nav className="navbar">
      {location.pathname === '/main' && (
        <>
          $
          {isMobileVersion && (
            <div
              className={`navbar__mobile-icon ${isMobileMenuActive && `active`}`}
              onClick={onMobileMenuIcon}
            >
              <span></span>
            </div>
          )}
          $
          {!isMobileVersion && (
            <>
              <p className="navbar__info">{email}</p>
              <Link to="/sign-in" className="navbar__link" onClick={exit}>
                Выйти
              </Link>
            </>
          )}
        </>
      )}
      {location.pathname === '/sign-in' && (
        <Link to="/sign-up" className="navbar__link">
          Регистрация
        </Link>
      )}
      {location.pathname === '/sign-up' && (
        <Link to="/sign-in" className="navbar__link">
          Войти
        </Link>
      )}
    </nav>
  );
}
export default NavigateBar;
