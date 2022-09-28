const errorMessage = {
  SERVER_ERROR: 'Ошибка на сервере',
  BAD_REQUEST: 'Переданы некорректные данные при запросе',
  UNAUTHORIZED: 'Ошибка авторизации',
  FORBIDDEN: 'Недостаточно прав для данного действия',
  NOT_FOUND: 'Запрашиваемый объект не найден',
  CONFLICT: 'Пользователь с таким email уже cуществует',
  INVALID_CREDENTIALS: 'Неправильные почта или пароль',
};

module.exports = errorMessage;
