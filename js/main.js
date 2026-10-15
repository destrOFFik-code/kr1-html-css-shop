// Получаем модальное окно по id.
const orderDialog = document.getElementById('order-dialog');

// Получаем кнопки заказа и общую кнопку обратной связи.
const orderButtons = document.querySelectorAll('.product-card__button[data-product], [data-open-order]');

// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById('selected-product');

// Признак ошибки нужен доступности, БЭМ-модификатор — оформлению поля.
function setFieldInvalid(field, invalid) {
  const fieldClass = {
    INPUT: 'order-form__input',
    SELECT: 'order-form__select',
    TEXTAREA: 'order-form__textarea',
  }[field.tagName];

  if (fieldClass) {
    field.classList.toggle(`${fieldClass}--error`, invalid);
  }

  if (invalid) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
}

// Клик по свободному месту снимает выбор поля и возвращает светлый фон.
orderDialog.addEventListener('click', (event) => {
  if (!event.target.closest('input, select, textarea, label, button')) {
    document.getElementById('order-dialog-title').focus({ preventScroll: true });
  }
});

// Подключаем открытие формы к каждой кнопке.
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Получаем название товара из data-атрибута.
    const productName = button.dataset.product || '';

    // Убираем ошибки от предыдущей попытки заполнения.
    orderForm.querySelectorAll('[aria-invalid]').forEach((field) => {
      setFieldInvalid(field, false);
    });
    successMessage.hidden = true;

    // Записываем название товара в скрытое поле формы.
    selectedProductInput.value = productName;

    // Открываем модальное окно.
    orderDialog.showModal();
  });
});

// Закрываем модальное окно по кнопке «Закрыть».
closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

// Получаем форму заявки.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

// Обрабатываем отправку формы.
orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  // Сбрасываем предыдущие признаки ошибок.
  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      setFieldInvalid(element, false);
    }
  });

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        setFieldInvalid(element, true);
      }
    });

    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }

  // Показываем сообщение об успешной отправке.
  successMessage.hidden = false;

  // Очищаем форму.
  orderForm.reset();

  // Закрываем модальное окно.
  orderDialog.close();
});
