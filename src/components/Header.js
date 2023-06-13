import React from 'react';
import logo from '../images/logo.svg';
function Header({ headerLink }) {
  return (
    <header className="header">
      <img src={logo} alt="Логотип Место" className="header__logo" />
      <p className="header__link">{headerLink}</p>
    </header>
  );
}
export default Header;
