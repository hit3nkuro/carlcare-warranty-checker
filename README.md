# carlcare-warranty-checker
carlcare-warranty-checker

Простенькая страничка для массовой проверки гарантии на смартфоны и телефоны Tecno, Infinix и itel.
Функционал нагло утянут с сайта Carlcare Сервис, конкретно страница проверки гарантии: https://www.carlcare.com/ru/warranty-check/ (конкретно скомунижжен POST-запрос, с помощью которого и делается вся магия).

В текстовое поле вводятся IMEI, каждый IMEI в новой строке, без посторонних символов. При нажатии на кнопку составляется массив значений, и в случае если в таблице еще нет такого значения (чтобы не добавлять дублирующие записи) отправляется запрос. Результат записывается в таблицу, дополнительно ответ дублируется в консоль.

Планы на будущее:
<ul>
  <li>Добавить панель с кнопками для таблицы (очистка таблицы, копирование таблицы целиком и пр.</li>
  <li>Почистить и откомментировать код</li>
</ul>
