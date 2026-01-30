/**
 *
 * Custom Map
 * Открытие модальных окон
 *
 * @author      Mihail Pridannikov
 * @copyright   2025-2026, Mihail Pridannikov
 * @license MIT
 * @version     2.0.1
 * @release     January 13, 2026
 * @link        https://github.com/mihail-174/custom_popup
 *
 */

window.CustomMaps = function(settingsCustom) {
    this.deepMergeObjects = function (obj1, obj2) {
        const result = {};
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (typeof obj2[key] === "object" && obj1.hasOwnProperty(key) && typeof obj1[key] === "object") {
                    result[key] = this.deepMergeObjects(obj1[key], obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                if (typeof obj1[key] === "object") {
                    result[key] = this.deepMergeObjects(obj1[key], {});
                } else {
                    result[key] = obj1[key];
                }
            }
        }
        return result;
    }

    const DEFAULT_SETTINGS = {
        multi: false,
        selector: 'map',
        zoom: 16,
        coords: [55.050432, 60.109599],
        // coords: [
        //     {
        //         name: 'Миасс',
        //         title: 'miass',
        //         coords: [55.050432, 60.109599],
        //         balloonContent: '',
        //     }
        // ],
        // controls: ["zoomControl", "fullscreenControl"],
        balloonContent: '',
        iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIGlkPSdMYXllcl8xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4PScwcHgnIHk9JzBweCcgdmlld0JveD0nMCAwIDUxMS45OTkgNTExLjk5OScgc3R5bGU9J2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjk5OSA1MTEuOTk5OycgeG1sOnNwYWNlPSdwcmVzZXJ2ZSc+PHBhdGggc3R5bGU9J2ZpbGw6I0VFMzg0MDsnIGQ9J000NTQuODQ4LDE5OC44NDhjMCwxNTkuMjI1LTE3OS43NTEsMzA2LjY4OS0xNzkuNzUxLDMwNi42ODljLTEwLjUwMyw4LjYxNy0yNy42OTIsOC42MTctMzguMTk1LDAgYzAsMC0xNzkuNzUxLTE0Ny40NjQtMTc5Ljc1MS0zMDYuNjg5QzU3LjE1Myw4OS4wMjcsMTQ2LjE4LDAsMjU2LDBTNDU0Ljg0OCw4OS4wMjcsNDU0Ljg0OCwxOTguODQ4eicvPjxwYXRoIHN0eWxlPSdmaWxsOiNGRkUxRDY7JyBkPSdNMjU2LDI5OC44OWMtNTUuMTY0LDAtMTAwLjA0MS00NC44NzktMTAwLjA0MS0xMDAuMDQxUzIwMC44MzgsOTguODA2LDI1Niw5OC44MDYgczEwMC4wNDEsNDQuODc5LDEwMC4wNDEsMTAwLjA0MVMzMTEuMTY0LDI5OC44OSwyNTYsMjk4Ljg5eicvPjwvc3ZnPg==',
        iconImageSize: [24, 24],
        iconImageOffset: [0, 0],
    }

    let settings = this.deepMergeObjects(DEFAULT_SETTINGS, settingsCustom);

    this.init = function () {
        if (settings.multi) {
            if (typeof ymaps !== "undefined") {
                ymaps.ready(() => {
                    let myMap = new ymaps.Map(settings.selector, {
                            center: [],
                            zoom: settings.zoom,
                            controls: settings.controls || ["zoomControl", "fullscreenControl"]
                        }, {
                            searchControlProvider: 'yandex#search',
                            suppressMapOpenBlock: true
                        }),
                        objectManager = new ymaps.ObjectManager({
                            clusterize: true,
                            gridSize: 32,
                            clusterDisableClickZoom: false
                        });

                    Object.values(settings.coords).map((item) => {
                        myMap.geoObjects.add(
                            new ymaps.Placemark(item.coords, {
                                balloonContent: item.balloonContent,
                            }, {
                                iconLayout: 'default#image',
                                iconImageHref: settings.iconImageHref,
                                iconImageSize: settings.iconImageSize,
                                iconImageOffset: settings.iconImageOffset,
                                balloonCloseButton: true,
                                hideIconOnBalloonOpen: true,
                            })
                        );
                    });

                    if (settings.zoom === 'all') {
                        let pointsList = [];

                        Object.values(settings.coords).map((item) => {
                            pointsList.push(item.coords);
                        });
                        myMap.setBounds(ymaps.util.bounds.fromPoints(pointsList));

                        let zoomNew = myMap.getZoom();
                        myMap.setZoom(16);
                        myMap.setZoom(zoomNew);

                        window.addEventListener('resize', (e) => {
                            myMap.setBounds(ymaps.util.bounds.fromPoints(pointsList));
                            myMap.setZoom(16);
                            myMap.setZoom(zoomNew);
                        });
                    } else {
                        myMap.setBounds(myMap.geoObjects.getBounds());
                    }

                    myMap.behaviors.disable("scrollZoom");
                });
            }
        } else {
            if (typeof ymaps !== "undefined") {
                ymaps.ready(() => {
                    const myMap = new ymaps.Map(settings.selector, {
                        center: Object.values(settings.coords),
                        zoom: settings.zoom,
                        controls: settings.controls || ["zoomControl", "fullscreenControl"]
                    }, {
                        searchControlProvider: 'yandex#search',
                        suppressMapOpenBlock: true
                    });
                    const myPlacemark = new ymaps.Placemark(Object.values(settings.coords), {
                        balloonContent: settings.balloonContent,
                    }, {
                        iconLayout: 'default#image',
                        iconImageHref: settings.iconImageHref,
                        iconImageSize: settings.iconImageSize,
                        iconImageOffset: settings.iconImageOffset,
                        balloonCloseButton: true,
                        hideIconOnBalloonOpen: true,
                    });
                    myMap.geoObjects.add(myPlacemark);
                    myMap.behaviors.disable("scrollZoom");
                });
            }

        }

    }

    this.init();
}