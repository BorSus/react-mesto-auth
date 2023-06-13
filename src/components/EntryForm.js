import React from 'react';

function EntryForm({ title, textSubmitButton, textLink }) {
  return (
    <section className="entry">
      <p className="entry__title">{title}</p>
      <form name="entryForm" className="entry__form">
        <div className="entry__valid-input">
          <input
            type="email"
            className="entry__input"
            name="email"
            id="inputEntryEmail"
            placeholder="Email"
            minLength="3"
            maxLength="64"
            required
          />
          <span className="entry__error" id="inputEntryEmail-error">
            &nbsp
          </span>
        </div>
        <div className="entry__valid-input">
          <input
            type="password"
            className="entry__input"
            name="password"
            id="inputEntryPassword"
            placeholder="Пароль"
            minLength="8"
            maxLength="64"
            required
          />
          <span className="entry__error" id="inputEntryPassword-error">
            &nbsp
          </span>
        </div>
        <button className="entry__submit" type="submit">
          {textSubmitButton}
        </button>
      </form>
      <p className="entry__link">{textLink}</p>
    </section>
  );
}
export default EntryForm;
