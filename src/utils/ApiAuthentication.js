import { optionsApiAuthentication } from './constants.js';
class ApiAuthentication {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._urlSignup = options.urlSignup;
    this._urlSignin = options.urlSignin;
    this._urlAuthorise = options.urlAuthorise;
  }
  //Проверка ответа сервера и преобразование из json
  _getResponseData(response) {
    if (!response.ok) {
      return Promise.reject(`Ошибка: ${response.status}`);
    }
    return response.json();
  }
  //Регистрация  нового пользователя
  async postNewUser(data) {
    const response = await fetch(`${this._baseUrl}${this._urlSignup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    });
    return this._getResponseData(response);
    /*  Успешный ответ пример:
    "data": {
        "_id": "5f5204c577488bcaa8b7bdf2",,
        "email": "email@yandex.ru"
    } */
  }
  //Вход пользователя
  async postLoginUser(data) {
    const response = await fetch(`${this._baseUrl}${this._urlSignin}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    });
    return this._getResponseData(response);
    /* Успешный ответ пример:
    {
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjUxNDhlNWJiODhmZGNhOTIxYjZhYzciLCJpYXQiOjE1OTkyMTExNzN9.Q3DVLh7t0f0BjyG9gh3UlUREYQxl2chdGTGy701lF6I"
    } 
    */
  }
  //Проверки валидности токена и получения email
  async getUserInfo(JWT) {
    const response = await fetch(`${this._baseUrl}${this._urlAuthorise}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT}`
      }
    });
    return this._getResponseData(response);
    /* Успешный ответ пример:
    {
    "_id":"1f525cf06e02630312f3fed7",
    "email":"email@email.ru"
    } 
    */
  }
}
export const apiAuthentication = new ApiAuthentication(optionsApiAuthentication);
