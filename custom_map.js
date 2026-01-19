ymaps.ready(function () {
    let myMap = new ymaps.Map('map', {
        center: [55.203277, 61.346112],
        zoom: 16,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });
    let myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        balloonContent: 'содержимое всплывающей подсказки',
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'img/pin.svg',
        iconImageSize: [136, 142],
        iconImageOffset: [-64, -124],
        balloonCloseButton: true, // балун будем открывать и закрывать кликом по иконке метки.
        hideIconOnBalloonOpen: true, // отключаем кнопку закрытия балуна.
    });
    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable("scrollZoom"); // запрет масштабирования при скроле
});
